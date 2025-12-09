# backend/api/__init__.py
from .auth import auth_bp
from .stocks import stocks_bp
from .predictions import predictions_bp
from .trading import trading_bp
from .analysis import analysis_bp
from .admin import admin_bp  # admin blueprint

__all__ = [
    'auth_bp',
    'stocks_bp',
    'predictions_bp',
    'trading_bp',
    'analysis_bp',
    'admin_bp',
]
