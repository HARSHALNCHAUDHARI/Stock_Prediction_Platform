from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.trading_service import TradingService

trading_bp = Blueprint('trading', __name__)


@trading_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_balance():
    """Get user's trading balance"""
    try:
        user_id = get_jwt_identity()
        balance = TradingService.get_user_balance(user_id)
        if balance is None:
            return jsonify({'error': 'Could not fetch balance'}), 500

        # Keep response shape same as before: {'balance': {...}}
        return jsonify({'balance': balance}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@trading_bp.route('/buy', methods=['POST'])
@jwt_required()
def buy_stock():
    """Buy stock (paper trading)"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        symbol = data.get('symbol')
        quantity = data.get('quantity')

        if not symbol or quantity is None:
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            quantity = float(quantity)
        except ValueError:
            return jsonify({'error': 'Quantity must be a number'}), 400

        if quantity <= 0:
            return jsonify({'error': 'Quantity must be positive'}), 400

        result, status = TradingService.buy_stock(user_id, symbol.upper(), quantity)

        # Keep message/transaction format consistent
        return jsonify(result), status

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@trading_bp.route('/sell', methods=['POST'])
@jwt_required()
def sell_stock():
    """Sell stock (paper trading)"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        symbol = data.get('symbol')
        quantity = data.get('quantity')

        if not symbol or quantity is None:
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            quantity = float(quantity)
        except ValueError:
            return jsonify({'error': 'Quantity must be a number'}), 400

        if quantity <= 0:
            return jsonify({'error': 'Quantity must be positive'}), 400

        result, status = TradingService.sell_stock(user_id, symbol.upper(), quantity)

        return jsonify(result), status

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@trading_bp.route('/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    """Get user's portfolio"""
    try:
        user_id = get_jwt_identity()
        portfolio = TradingService.get_portfolio(user_id)

        # Keep response shape: {'portfolio': [...]}
        return jsonify({'portfolio': portfolio}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@trading_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get user's transaction history"""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 50, type=int)

        txns = TradingService.get_transactions(user_id, limit=limit)

        return jsonify({'transactions': txns}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
