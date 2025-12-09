"""
XGBoost regression model for stock prediction
"""
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import MinMaxScaler


class XGBoostModel:
    """XGBoost-based price predictor"""
    
    @staticmethod
    def prepare_features(df):
        """Extract features for XGBoost"""
        data = df.copy()
        
        # Price features
        data['returns'] = data['close'].pct_change()
        data['log_returns'] = np.log(data['close'] / data['close'].shift(1))
        
        # Moving averages
        for window in [5, 10, 20]:
            data[f'ma_{window}'] = data['close'].rolling(window=window).mean()
            data[f'ma_{window}_ratio'] = data['close'] / data[f'ma_{window}']
        
        # Volatility
        data['volatility_10'] = data['returns'].rolling(window=10).std()
        data['volatility_30'] = data['returns'].rolling(window=30).std()
        
        # Volume
        data['volume_ma_5'] = data['volume'].rolling(window=5).mean()
        data['volume_ratio'] = data['volume'] / data['volume_ma_5']
        
        # Target: next day's return
        data['target'] = data['returns'].shift(-1)
        
        data = data.dropna()
        
        feature_cols = [
            'returns', 'log_returns',
            'ma_5_ratio', 'ma_10_ratio', 'ma_20_ratio',
            'volatility_10', 'volatility_30', 'volume_ratio'
        ]
        
        return data, feature_cols
    
    @staticmethod
    def predict(df, days=7):
        """Train and predict using XGBoost"""
        try:
            data, feature_cols = XGBoostModel.prepare_features(df)
            
            if len(data) < 50:
                return None
            
            X = data[feature_cols].values
            y = data['target'].values
            
            # Train on all data (in production, use train/test split)
            model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42
            )
            
            model.fit(X, y)
            
            # Predict next days iteratively
            last_close = df['close'].iloc[-1]
            predictions = []
            current_price = last_close
            
            for _ in range(days):
                # Use last known features
                last_features = X[-1:].copy()
                predicted_return = model.predict(last_features)[0]
                
                # Calculate next price
                next_price = current_price * (1 + predicted_return)
                predictions.append(float(next_price))
                current_price = next_price
            
            return np.array(predictions)
            
        except Exception as e:
            print(f"XGBoostModel error: {e}")
            return None
