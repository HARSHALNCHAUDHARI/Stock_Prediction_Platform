from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date


db = SQLAlchemy()


def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("✅ Database initialized successfully!")


# User Model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    portfolios = db.relationship(
        'Portfolio',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan',
    )
    watchlists = db.relationship(
        'Watchlist',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan',
    )
    predictions = db.relationship(
        'PredictionHistory',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan',
    )
    transactions = db.relationship(
        'Transaction',
        backref='user',
        lazy=True,
        cascade='all, delete-orphan',
    )
    balance = db.relationship(
        'UserBalance',
        backref='user',
        uselist=False,
        lazy=True,
        cascade='all, delete-orphan',
    )

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# Stock Model
class Stock(db.Model):
    __tablename__ = 'stocks'

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    company_name = db.Column(db.String(200))
    sector = db.Column(db.String(100))
    industry = db.Column(db.String(100))
    market_cap = db.Column(db.Float)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'company_name': self.company_name,
            'sector': self.sector,
            'industry': self.industry,
            'market_cap': self.market_cap,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        }


# Portfolio Model (Paper Trading)
class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    avg_buy_price = db.Column(db.Float, nullable=False)
    total_invested = db.Column(db.Float, nullable=False)
    current_value = db.Column(db.Float)
    profit_loss = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'symbol': self.symbol,
            'quantity': self.quantity,
            'avg_buy_price': self.avg_buy_price,
            'total_invested': self.total_invested,
            'current_value': self.current_value,
            'profit_loss': self.profit_loss,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# Transaction Model
class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # BUY or SELL
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'symbol': self.symbol,
            'transaction_type': self.transaction_type,
            'quantity': self.quantity,
            'price': self.price,
            'total_amount': self.total_amount,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }


# Watchlist Model
class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'symbol': self.symbol,
            'added_at': self.added_at.isoformat() if self.added_at else None,
        }


# Prediction History Model
class PredictionHistory(db.Model):
    __tablename__ = 'prediction_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    prediction_date = db.Column(db.DateTime, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    actual_price = db.Column(db.Float)
    model_used = db.Column(db.String(50))
    confidence_score = db.Column(db.Float)
    direction = db.Column(db.String(10))  # UP or DOWN
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'symbol': self.symbol,
            'prediction_date': self.prediction_date.isoformat() if self.prediction_date else None,
            'predicted_price': self.predicted_price,
            'actual_price': self.actual_price,
            'model_used': self.model_used,
            'confidence_score': self.confidence_score,
            'direction': self.direction,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# User Balance Model (Paper Trading)
class UserBalance(db.Model):
    __tablename__ = 'user_balances'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    cash_balance = db.Column(db.Float, default=100000.0)  # Virtual $100k
    total_portfolio_value = db.Column(db.Float, default=0.0)
    total_profit_loss = db.Column(db.Float, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cash_balance': self.cash_balance,
            'total_portfolio_value': self.total_portfolio_value,
            'total_profit_loss': self.total_profit_loss,
            'total_value': (self.cash_balance or 0.0) + (self.total_portfolio_value or 0.0),
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        }


# Stock Price History Model
class StockPrice(db.Model):
    __tablename__ = 'stock_prices'

    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    open = db.Column(db.Float, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.BigInteger, nullable=False)

    # Relationship back to Stock
    stock = db.relationship('Stock', backref='prices')

    def to_dict(self):
        return {
            'id': self.id,
            'stock_id': self.stock_id,
            'date': self.date.isoformat() if isinstance(self.date, (datetime, date)) else str(self.date),
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'close': self.close,
            'volume': self.volume,
        }
