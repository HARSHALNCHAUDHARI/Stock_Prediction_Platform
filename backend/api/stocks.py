from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
from config.database import db, Stock, Watchlist
from services.data_service import DataService

stocks_bp = Blueprint('stocks', __name__)


@stocks_bp.route('/search', methods=['GET'])
@jwt_required()
def search_stocks():
    """Search for stocks by symbol or name"""
    try:
        query = request.args.get('q', '').upper()
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Use DataService search (same popular list idea)
        results = DataService.search_stocks(query)
        
        return jsonify({'results': results}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/info/<symbol>', methods=['GET'])
@jwt_required()
def get_stock_info(symbol):
    """Get detailed stock information"""
    try:
        symbol = symbol.upper()
        info = DataService.fetch_stock_info(symbol)
        
        if not info:
            return jsonify({'error': 'Stock not found'}), 404
        
        stock_data = {
            'symbol': symbol,
            'name': info.get('name', symbol),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'current_price': info.get('current_price', 0),
            'previous_close': info.get('previous_close', 0),
            'open': info.get('open', 0),
            'day_high': info.get('day_high', 0),
            'day_low': info.get('day_low', 0),
            'volume': info.get('volume', 0),
            'market_cap': info.get('market_cap', 0),
            'pe_ratio': info.get('pe_ratio', 0),
            '52_week_high': info.get('52_week_high', 0),
            '52_week_low': info.get('52_week_low', 0),
            'dividend_yield': 0,  # yfinance may not always give this cleanly
            'beta': info.get('beta', 0),
            'description': info.get('description', 'No description available')
        }
        
        return jsonify({'stock': stock_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/historical/<symbol>', methods=['GET'])
@jwt_required()
def get_historical_data(symbol):
    """Get historical stock data"""
    try:
        symbol = symbol.upper()
        period = request.args.get('period', '1y')
        interval = request.args.get('interval', '1d')
        
        # Use yfinance directly here to preserve interval behavior
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            return jsonify({'error': 'No data available'}), 404
        
        data = []
        for index, row in hist.iterrows():
            data.append({
                'date': index.strftime('%Y-%m-%d'),
                'timestamp': int(index.timestamp() * 1000),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume'])
            })
        
        return jsonify({
            'symbol': symbol,
            'period': period,
            'interval': interval,
            'data': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/realtime/<symbol>', methods=['GET'])
@jwt_required()
def get_realtime_price(symbol):
    """Get real-time stock price"""
    try:
        symbol = symbol.upper()
        stock = yf.Ticker(symbol)
        
        hist = stock.history(period='1d', interval='1m')
        
        if hist.empty:
            return jsonify({'error': 'No real-time data available'}), 404
        
        latest = hist.iloc[-1]
        
        info = stock.info
        previous_close = info.get('previousClose', latest['Close'])
        change = latest['Close'] - previous_close
        change_percent = (change / previous_close) * 100 if previous_close > 0 else 0
        
        return jsonify({
            'symbol': symbol,
            'price': float(latest['Close']),
            'change': float(change),
            'change_percent': float(change_percent),
            'timestamp': int(hist.index[-1].timestamp() * 1000),
            'volume': int(latest['Volume'])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    """Get user's watchlist"""
    try:
        user_id = get_jwt_identity()
        watchlist = Watchlist.query.filter_by(user_id=user_id).all()
        
        stocks = []
        for item in watchlist:
            try:
                info = DataService.fetch_stock_info(item.symbol)
                if not info:
                    continue
                stocks.append({
                    'id': item.id,
                    'symbol': item.symbol,
                    'name': info.get('name', item.symbol),
                    'current_price': info.get('current_price', 0),
                    'change_percent': 0,  # could compute from previous_close if needed
                    'added_at': item.added_at.isoformat()
                })
            except:
                continue
        
        return jsonify({'watchlist': stocks}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/watchlist', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    """Add stock to watchlist"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'symbol' not in data:
            return jsonify({'error': 'Symbol is required'}), 400
        
        symbol = data['symbol'].upper()
        
        existing = Watchlist.query.filter_by(user_id=user_id, symbol=symbol).first()
        if existing:
            return jsonify({'error': 'Stock already in watchlist'}), 409
        
        info = DataService.fetch_stock_info(symbol)
        if not info:
            return jsonify({'error': 'Invalid stock symbol'}), 404
        
        watchlist_item = Watchlist(user_id=user_id, symbol=symbol)
        db.session.add(watchlist_item)
        db.session.commit()
        
        return jsonify({
            'message': 'Stock added to watchlist',
            'item': watchlist_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/watchlist/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_watchlist(item_id):
    """Remove stock from watchlist"""
    try:
        user_id = get_jwt_identity()
        item = Watchlist.query.filter_by(id=item_id, user_id=user_id).first()
        
        if not item:
            return jsonify({'error': 'Watchlist item not found'}), 404
        
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Stock removed from watchlist'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@stocks_bp.route('/trending', methods=['GET'])
@jwt_required()
def get_trending_stocks():
    """Get trending stocks (popular list with live data)"""
    try:
        trending_symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM']
        
        trending = []
        for symbol in trending_symbols:
            try:
                info = DataService.fetch_stock_info(symbol)
                if not info:
                    continue
                trending.append({
                    'symbol': symbol,
                    'name': info.get('name', symbol),
                    'current_price': info.get('current_price', 0),
                    'change_percent': 0,  # could compute if needed
                    'volume': info.get('volume', 0)
                })
            except:
                continue
        
        return jsonify({'trending': trending}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
