import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///stock_platform.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Stock Data Settings
    DEFAULT_STOCK_PERIOD = '2y'  # 2 years of historical data
    PREDICTION_DAYS = 30  # Predict next 30 days
    
    # ML Model Settings
    LSTM_EPOCHS = 50
    LSTM_BATCH_SIZE = 32
    SEQUENCE_LENGTH = 60  # Use 60 days to predict next day
    
    # Paper Trading Settings
    INITIAL_VIRTUAL_BALANCE = 100000  # $100,000 virtual money
    
    # Free API Keys (using free tiers)
    ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')
    NEWS_API_KEY = os.getenv('NEWS_API_KEY', '')
    
    # Pagination
    ITEMS_PER_PAGE = 20
    
    # Cache Settings
    CACHE_STOCK_DATA_HOURS = 1
    
    # Risk Analysis Settings
    RISK_FREE_RATE = 0.02  # 2% annual risk-free rate

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
