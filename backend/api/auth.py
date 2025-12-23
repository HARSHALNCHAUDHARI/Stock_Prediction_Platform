from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash
from config.database import db, User, UserBalance
from datetime import timedelta


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json() or {}

        # Validate input
        if not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': 'Missing required fields'}), 400

        username = data['username']
        email = data['email']
        password = data['password']
        full_name = data.get('full_name', '')

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        # Create new user (normal user by default; set is_admin=True manually in DB for admins)
        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            full_name=full_name,
        )
        db.session.add(new_user)
        db.session.flush()  # ensure new_user.id is available before creating balance [web:158][web:161]

        # Create user balance (e.g. default virtual money handled by model default)
        balance = UserBalance(user_id=new_user.id)
        db.session.add(balance)

        # Single commit for both user and balance
        db.session.commit()

        # Generate access token (identity must be string)
        # Also include is_admin flag as custom claim for the frontend [web:165]
        access_token = create_access_token(
            identity=str(new_user.id),
            additional_claims={"is_admin": new_user.is_admin},
            expires_delta=timedelta(days=7),
        )

        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': new_user.to_dict(),
        }), 201

    except Exception as e:
        db.session.rollback()
        # Do not leak internal exception details in production
        print(f"❌ Signup error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login (works for both user and admin accounts)"""
    try:
        data = request.get_json() or {}

        if not all(k in data for k in ('username', 'password')):
            return jsonify({'error': 'Missing username or password'}), 400

        username = data['username']
        password = data['password']

        # Find user
        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid username or password'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403

        # Generate access token (identity must be string)
        # Important: also embed is_admin so frontend can route to right portal [web:165]
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"is_admin": user.is_admin},
            expires_delta=timedelta(days=7),
        )

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict(),
        }), 200

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        print(f"❌ Get profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}

        if 'full_name' in data:
            user.full_name = data['full_name']

        if 'email' in data:
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user_id:
                return jsonify({'error': 'Email already in use'}), 409
            user.email = data['email']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(),
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Update profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}

        if not all(k in data for k in ('current_password', 'new_password')):
            return jsonify({'error': 'Missing required fields'}), 400

        if not check_password_hash(user.password_hash, data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401

        user.password_hash = generate_password_hash(data['new_password'])
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f("❌ Change password error: {str(e)}"))
        return jsonify({'error': 'Failed to change password'}), 500
