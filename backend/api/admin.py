# backend/api/admin.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import (
    db,
    User,
    PredictionHistory,
    Transaction,
    Watchlist,
    UserBalance,
    Portfolio,
)

admin_bp = Blueprint('admin', __name__)

def _ensure_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return None
    return user

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def admin_stats():
    user = _ensure_admin()
    if not user:
        return jsonify({'error': 'Admin access required'}), 403

    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    admin_users = User.query.filter_by(is_admin=True).count()

    total_predictions = PredictionHistory.query.count()
    total_trades = Transaction.query.count()
    total_watchlist_items = Watchlist.query.count()
    portfolios_count = Portfolio.query.count()

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
