from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from config.database import db, PredictionHistory
from services.data_service import DataService
from services.ml_service import MLService

predictions_bp = Blueprint('predictions', __name__)


@predictions_bp.route('/predict/<symbol>', methods=['GET'])
@jwt_required()
def predict_stock(symbol):
    """Generate stock price prediction (ML first, fallback to linear trend)"""
    try:
        user_id = int(get_jwt_identity())
        symbol = symbol.upper()

        # Get historical data (6 months for better context)
        hist_data = DataService.fetch_historical_data(symbol, period='6mo')
        if not hist_data:
            return jsonify({'error': 'No historical data available'}), 404

        # Build DataFrame
        df = pd.DataFrame(hist_data)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)

        close_prices = df['close'].values.astype(float)
        last_price = float(close_prices[-1])

        # ---------- 1) Try ML-based predictions ----------
        predictions = None
        model_name = None
        note = None

        try:
            ml_predictions = MLService.predict(symbol, df, days=7)
        except Exception as e:
            print(f"MLService.predict error for {symbol}: {e}")
            ml_predictions = None

        if ml_predictions and isinstance(ml_predictions, list) and isinstance(ml_predictions[0], dict):
            # MLService already returns dicts with date/predicted_price/confidence/direction
            predictions = ml_predictions
            model_name = 'ML Ensemble'
            note = 'Using FREE ML models with technical features'
        else:
            # ---------- 2) Fallback to linear trend ----------
            days_len = len(close_prices)
            x = np.arange(days_len)
            z = np.polyfit(x, close_prices, 1)
            p = np.poly1d(z)

            predictions = []
            for i in range(1, 8):
                predicted_price = float(p(days_len + i))
                prediction_date = datetime.now() + timedelta(days=i)
                direction = 'UP' if predicted_price > last_price else 'DOWN'
                confidence = min(
                    abs((predicted_price - last_price) / last_price) * 100,
                    95
                )

                predictions.append({
                    'date': prediction_date.strftime('%Y-%m-%d'),
                    'predicted_price': round(predicted_price, 2),
                    'confidence': round(confidence, 2),
                    'direction': direction
                })

            model_name = 'Linear Trend'
            note = 'Fallback to linear trend model'

        # Save to history
        first = predictions[0]
        prediction_record = PredictionHistory(
            user_id=user_id,
            symbol=symbol,
            prediction_date=datetime.strptime(first['date'], '%Y-%m-%d'),
            predicted_price=first['predicted_price'],
            model_used=model_name,
            confidence_score=first['confidence'],
            direction=first['direction']
        )
        db.session.add(prediction_record)
        db.session.commit()

        return jsonify({
            'symbol': symbol,
            'current_price': last_price,
            'predictions': predictions,
            'model': f'{model_name} Analysis',
            'note': note
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
