"""
ML Service - Stock prediction using FREE ML models
"""
import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler


class MLService:
    """Service for ML predictions"""

    MODELS_DIR = 'ml_models/trained_models'

    @staticmethod
    def prepare_features(prices_df: pd.DataFrame) -> pd.DataFrame:
        """Prepare technical features and target for ML model"""
        df = prices_df.copy()

        # Technical indicators
        df['MA5'] = df['close'].rolling(window=5).mean()
        df['MA10'] = df['close'].rolling(window=10).mean()
        df['MA20'] = df['close'].rolling(window=20).mean()
        df['MA50'] = df['close'].rolling(window=50).mean()

        # Volatility
        df['volatility'] = df['close'].rolling(window=10).std()

        # Price changes
        df['price_change'] = df['close'].pct_change()
        df['price_change_5d'] = df['close'].pct_change(periods=5)

        # Volume changes
        df['volume_change'] = df['volume'].pct_change()

        # RSI
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))

        # Target: next day's close
        df['target'] = df['close'].shift(-1)

        df = df.dropna()

        return df

    @staticmethod
    def train_model(symbol: str, historical_data: pd.DataFrame):
        """Train a RandomForest model for a specific stock"""
        try:
            if len(historical_data) < 100:
                print(f"Not enough data for {symbol}")
                return None

            df = MLService.prepare_features(historical_data)

            if len(df) < 50:
                print(f"Not enough processed data for {symbol}")
                return None

            feature_columns = [
                'MA5', 'MA10', 'MA20', 'MA50', 'volatility',
                'price_change', 'price_change_5d', 'volume_change', 'RSI'
            ]

            X = df[feature_columns].values
            y = df['target'].values

            scaler = MinMaxScaler()
            X_scaled = scaler.fit_transform(X)

            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )

            model.fit(X_scaled, y)

            os.makedirs(MLService.MODELS_DIR, exist_ok=True)
            model_path = os.path.join(MLService.MODELS_DIR, f'{symbol}_model.pkl')
            scaler_path = os.path.join(MLService.MODELS_DIR, f'{symbol}_scaler.pkl')

            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)

            score = model.score(X_scaled, y)
            print(f"✅ RF model trained for {symbol} - Score: {score:.4f}")

            return {
                'model': model,
                'scaler': scaler,
                'score': score
            }

        except Exception as e:
            print(f"Error training model for {symbol}: {str(e)}")
            return None

    @staticmethod
    def load_model(symbol: str):
        """Load trained RandomForest model for a symbol"""
        try:
            model_path = os.path.join(MLService.MODELS_DIR, f'{symbol}_model.pkl')
            scaler_path = os.path.join(MLService.MODELS_DIR, f'{symbol}_scaler.pkl')

            if not os.path.exists(model_path) or not os.path.exists(scaler_path):
                return None

            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)

            return {'model': model, 'scaler': scaler}

        except Exception as e:
            print(f"Error loading model for {symbol}: {str(e)}")
            return None

    @staticmethod
    def predict(symbol: str, historical_data, days: int = 7):
        """
        Predict future prices.

        1) Try advanced EnsembleModel if available.
        2) If ensemble fails, fall back to RandomForest-only logic.
        3) Always return list of dicts:
           [{date, predicted_price, confidence, direction}, ...]
        """
        try:
            # Ensure DataFrame with date index, close, volume
            if isinstance(historical_data, pd.DataFrame):
                df_raw = historical_data.copy()
            else:
                df_raw = pd.DataFrame(historical_data)
                df_raw['date'] = pd.to_datetime(df_raw['date'])
                df_raw.set_index('date', inplace=True)

            if df_raw.empty or len(df_raw) < 50:
                print(f"Not enough raw data for {symbol}")
                return None

            last_price = float(df_raw['close'].iloc[-1])

            # ---------- 1) Try EnsembleModel ----------
            ensemble_predictions = None
            try:
                from ml_models.ensemble import EnsembleModel
                ensemble_array = EnsembleModel.predict(df_raw, days)
                if ensemble_array is not None and len(ensemble_array) == days:
                    ensemble_predictions = [
                        float(p) for p in ensemble_array
                    ]
            except Exception as e:
                print(f"EnsembleModel error for {symbol}: {e}")
                ensemble_predictions = None

            # If ensemble worked, format and return
            if ensemble_predictions is not None:
                predictions = []
                current_price = last_price
                for i, price in enumerate(ensemble_predictions, start=1):
                    prediction_date = datetime.now() + timedelta(days=i)
                    direction = 'UP' if price > current_price else 'DOWN'
                    change_pct = abs((price - current_price) / current_price) * 100
                    confidence = min(50 + change_pct, 95)

                    predictions.append({
                        'date': prediction_date.strftime('%Y-%m-%d'),
                        'predicted_price': round(price, 2),
                        'confidence': round(confidence, 2),
                        'direction': direction
                    })
                    current_price = price
                return predictions

            # ---------- 2) Fall back to RandomForest ----------
            model_data = MLService.load_model(symbol)
            if not model_data:
                model_data = MLService.train_model(symbol, df_raw)
                if not model_data:
                    return None

            model = model_data['model']
            scaler = model_data['scaler']

            df_feat = MLService.prepare_features(df_raw)
            if df_feat.empty:
                return None

            feature_columns = [
                'MA5', 'MA10', 'MA20', 'MA50', 'volatility',
                'price_change', 'price_change_5d', 'volume_change', 'RSI'
            ]

            latest_features = df_feat[feature_columns].iloc[-1:].values
            latest_features_scaled = scaler.transform(latest_features)

            predictions = []
            current_price = float(df_feat['close'].iloc[-1])

            for i in range(days):
                predicted_price = float(model.predict(latest_features_scaled)[0])
                prediction_date = datetime.now() + timedelta(days=i + 1)

                direction = 'UP' if predicted_price > current_price else 'DOWN'
                change_pct = abs((predicted_price - current_price) / current_price) * 100
                confidence = min(50 + change_pct, 95)

                predictions.append({
                    'date': prediction_date.strftime('%Y-%m-%d'),
                    'predicted_price': round(predicted_price, 2),
                    'confidence': round(confidence, 2),
                    'direction': direction
                })

                current_price = predicted_price

            return predictions

        except Exception as e:
            print(f"Error predicting for {symbol}: {str(e)}")
            return None
