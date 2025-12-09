"""
Data Service - FREE stock data using yfinance
"""
import yfinance as yf
import pandas as pd
from datetime import datetime
from config.database import db, Stock, StockPrice


class DataService:
    """Service for fetching and storing stock data"""
    
    @staticmethod
    def fetch_stock_info(symbol):
        """Fetch basic stock information"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            return {
                'symbol': symbol,
                'name': info.get('longName', symbol),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'description': info.get('longBusinessSummary', ''),
                'market_cap': info.get('marketCap', 0),
                'pe_ratio': info.get('trailingPE'),
                'current_price': info.get('currentPrice'),
                'previous_close': info.get('previousClose'),
                'day_high': info.get('dayHigh'),
                'day_low': info.get('dayLow'),
                'volume': info.get('volume'),
                '52_week_high': info.get('fiftyTwoWeekHigh'),
                '52_week_low': info.get('fiftyTwoWeekLow'),
                'beta': info.get('beta')
            }
        except Exception as e:
            print(f"Error fetching {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def fetch_historical_data(symbol, period='1y'):
        """Fetch historical price data"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty:
                return None
            
            data = []
            for date, row in hist.iterrows():
                data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': int(row['Volume'])
                })
            
            return data
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def store_stock_in_db(symbol):
        """Store stock info in database"""
        try:
            stock = Stock.query.filter_by(symbol=symbol).first()
            if stock:
                return stock
            
            info = DataService.fetch_stock_info(symbol)
            if not info:
                return None
            
            stock = Stock(
                symbol=symbol,
                company_name=info['name'],
                sector=info.get('sector'),
                industry=info.get('industry'),
                market_cap=info.get('market_cap')
            )
            
            db.session.add(stock)
            db.session.commit()
            return stock
        except Exception as e:
            db.session.rollback()
            print(f"Error storing {symbol} in DB: {str(e)}")
            return None
    
    @staticmethod
    def store_price_data(symbol, days=30):
        """Store historical price data in database"""
        try:
            stock = DataService.store_stock_in_db(symbol)
            if not stock:
                return False
            
            hist_data = DataService.fetch_historical_data(symbol, period=f'{days}d')
            if not hist_data:
                return False
            
            for day_data in hist_data:
                date = datetime.strptime(day_data['date'], '%Y-%m-%d').date()
                existing = StockPrice.query.filter_by(
                    stock_id=stock.id,
                    date=date
                ).first()
                if existing:
                    continue
                
                price = StockPrice(
                    stock_id=stock.id,
                    date=date,
                    open=day_data['open'],
                    high=day_data['high'],
                    low=day_data['low'],
                    close=day_data['close'],
                    volume=day_data['volume']
                )
                db.session.add(price)
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error storing price data for {symbol}: {str(e)}")
            return False
    
    @staticmethod
    def get_real_time_price(symbol):
        """Get current real-time price"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period='1d')
            if data.empty:
                return None
            return float(data['Close'].iloc[-1])
        except Exception as e:
            print(f"Error getting real-time price for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def search_stocks(query):
        """Search for stocks (simple implementation)"""
        popular_stocks = {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corporation',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla, Inc.',
            'META': 'Meta Platforms Inc.',
            'NVDA': 'NVIDIA Corporation',
            'AMD': 'Advanced Micro Devices',
            'NFLX': 'Netflix Inc.',
            'DIS': 'The Walt Disney Company',
            'JPM': 'JPMorgan Chase & Co.',
            'BAC': 'Bank of America Corp',
            'WMT': 'Walmart Inc.',
            'V': 'Visa Inc.',
            'MA': 'Mastercard Inc.'
        }
        
        query = query.upper()
        results = []
        
        for symbol, name in popular_stocks.items():
            if query in symbol or query.lower() in name.lower():
                results.append({'symbol': symbol, 'name': name})
        
        return results[:10]
