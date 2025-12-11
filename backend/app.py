from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from config.config import config
from config.database import db, init_db, User, UserBalance
from api.auth import auth_bp
from api.stocks import stocks_bp
from api.predictions import predictions_bp
from api.trading import trading_bp
from api.analysis import analysis_bp
from api.admin import admin_bp  # NEW
import os
from werkzeug.security import generate_password_hash


def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])

    # Enable CORS for React frontend (localhost:3000 and 5173)
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://localhost:5173"
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
        supports_credentials=True,
    )

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize database
    init_db(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(stocks_bp, url_prefix='/api/stocks')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(trading_bp, url_prefix='/api/trading')
    app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')  # NEW

    # Handle CORS preflight (so JWT / other logic does not block OPTIONS)
    @app.before_request
    def handle_options_preflight():
        if request.method == "OPTIONS":
            # Empty 200; flask-cors will add the CORS headers
            return make_response("", 200)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'message': 'Stock Prediction API is running!',
            'version': '1.0.0'
        }), 200

    # Root endpoint
    @app.route('/', methods=['GET'])
    def index():
        """Root endpoint"""
        return jsonify({
            'message': 'Welcome to Stock Prediction Platform API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'stocks': '/api/stocks',
                'predictions': '/api/predictions',
                'trading': '/api/trading',
                'analysis': '/api/analysis',
                'admin': '/api/admin',   # NEW
            }
        }), 200

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error': 'Token has expired',
            'message': 'Please login again'
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        # Debug log in backend console
        print("JWT invalid_token_loader error:", error)
        return jsonify({
            'error': 'Invalid token',
            'message': 'Token verification failed',
            'detail': str(error)
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Authorization required',
            'message': 'Request does not contain a valid token'
        }), 401

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not found',
            'message': 'The requested URL was not found'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500

    # Create default admin user on first run
    with app.app_context():
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@stockapp.com',
                password_hash=generate_password_hash('admin123'),
                full_name='Admin User',
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()

            # Create balance for admin
            balance = UserBalance(user_id=admin.id)
            db.session.add(balance)
            db.session.commit()
            print("✅ Default admin user created (username: admin, password: admin123)")

    return app


if __name__ == '__main__':
    app = create_app()
    print("\n" + "="*60)
    print("🚀 Stock Prediction Platform API")
    print("="*60)
    print("📍 Running on: http://127.0.0.1:5001")
    print("📊 Health Check: http://127.0.0.1:5001/api/health")
    print("🔐 Admin Login: username=admin, password=admin123")
    print("="*60 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5001)
