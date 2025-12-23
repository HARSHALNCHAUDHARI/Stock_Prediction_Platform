# backend/api/admin.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from config.database import (
    db,
    User,
    PredictionHistory,
    Transaction,
    Watchlist,
    UserBalance,
    Portfolio,
)


admin_bp = Blueprint('admin', __name__, url_prefix="/admin")


def _ensure_admin():
    """
    Ensure current JWT belongs to an admin.
    Uses is_admin claim from token and verifies against DB user.
    """
    claims = get_jwt()  # read custom claims from token [web:150][web:153]
    if not claims.get("is_admin"):
        return None

    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return None

    user = User.query.get(user_id)  # still valid in Flask‑SQLAlchemy 3.x, though legacy in SA 2.x [web:149][web:152]
    if not user or not user.is_admin or not user.is_active:
        return None

    return user


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def admin_stats():
    """Get platform-wide statistics"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        admin_users = User.query.filter_by(is_admin=True).count()

        total_predictions = PredictionHistory.query.count()
        total_trades = Transaction.query.count()
        total_watchlist_items = Watchlist.query.count()

        # Count unique users with portfolios
        portfolios_count = db.session.query(
            db.func.count(db.func.distinct(Portfolio.user_id))
        ).scalar() or 0

        total_pnl = db.session.query(
            db.func.coalesce(db.func.sum(UserBalance.total_profit_loss), 0.0)
        ).scalar() or 0.0

        symbol_stats = (
            db.session.query(
                Transaction.symbol,
                db.func.count(Transaction.id).label('trade_count'),
                db.func.sum(Transaction.total_amount).label('total_volume'),
            )
            .group_by(Transaction.symbol)
            .order_by(db.desc('trade_count'))
            .limit(5)
            .all()
        )

        top_symbols = [
            {
                'symbol': s.symbol,
                'trade_count': int(s.trade_count),
                'total_volume': float(s.total_volume or 0),
            }
            for s in symbol_stats
        ]

        return jsonify({
            'users': {
                'total': total_users,
                'active': active_users,
                'admins': admin_users,
            },
            'activity': {
                'predictions': total_predictions,
                'trades': total_trades,
                'watchlist_items': total_watchlist_items,
                'portfolios': portfolios_count,
            },
            'performance': {
                'total_pnl': float(total_pnl),
            },
            'top_symbols': top_symbols,
        }), 200

    except Exception as e:
        print(f"❌ Admin stats error: {str(e)}")
        return jsonify({'error': 'Failed to fetch admin stats'}), 500


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    """Get all users"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        users = User.query.order_by(User.created_at.desc()).all()
        return jsonify([u.to_dict() for u in users]), 200
    except Exception as e:
        print(f"❌ List users error: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get single user details"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        balance = UserBalance.query.filter_by(user_id=user_id).first()
        portfolio_count = Portfolio.query.filter_by(user_id=user_id).count()
        transaction_count = Transaction.query.filter_by(user_id=user_id).count()
        prediction_count = PredictionHistory.query.filter_by(user_id=user_id).count()

        user_data = user.to_dict()
        user_data['stats'] = {
            'balance': balance.to_dict() if balance else None,
            'portfolios': portfolio_count,
            'transactions': transaction_count,
            'predictions': prediction_count,
        }

        return jsonify(user_data), 200
    except Exception as e:
        print(f"❌ Get user error: {str(e)}")
        return jsonify({'error': 'Failed to fetch user'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    """Update user (activate/deactivate, admin role)"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}

        # Prevent self-demotion from admin
        if user.id == admin_user.id and 'is_admin' in data and not data['is_admin']:
            return jsonify({'error': 'Cannot remove admin role from yourself'}), 400

        if 'is_active' in data:
            user.is_active = bool(data['is_active'])

        if 'is_admin' in data:
            user.is_admin = bool(data['is_admin'])

        db.session.commit()

        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Update user error: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Delete a user (soft delete by deactivating)"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Prevent self-deletion
        if user.id == admin_user.id:
            return jsonify({'error': 'Cannot delete your own account'}), 400

        user.is_active = False
        db.session.commit()

        return jsonify({'message': 'User deactivated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Delete user error: {str(e)}")
        return jsonify({'error': 'Failed to delete user'}), 500


@admin_bp.route('/reports', methods=['GET'])
@jwt_required()
def list_reports():
    """Get available reports (mock for now)"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    reports = [
        {
            'id': 1,
            'name': 'Daily Platform Summary',
            'last_generated': '2025-12-11T08:00:00',
            'status': 'sent',
        },
        {
            'id': 2,
            'name': 'Weekly Risk Report',
            'last_generated': '2025-12-09T20:00:00',
            'status': 'idle',
        },
    ]

    return jsonify(reports), 200


@admin_bp.route('/reports/<int:report_id>/run', methods=['POST'])
@jwt_required()
def run_report(report_id):
    """Trigger report generation"""
    admin_user = _ensure_admin()
    if not admin_user:
        return jsonify({'error': 'Admin access required'}), 403

    try:
        from datetime import datetime

        return jsonify({
            'message': 'Report generation started',
            'report_id': report_id,
            'status': 'running',
            'started_at': datetime.utcnow().isoformat(),
        }), 200

    except Exception as e:
        print(f"❌ Run report error: {str(e)}")
        return jsonify({'error': 'Failed to run report'}), 500
