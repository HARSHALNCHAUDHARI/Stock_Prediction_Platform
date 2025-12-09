"""
LSTM Model for Stock Prediction (FREE - using scikit-learn alternative)
Note: Full LSTM requires TensorFlow/PyTorch, but keeping it simple with sklearn
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler
import joblib


class LSTMModel:
    """
    Simplified LSTM-style model using Gradient Boosting
    (Alternative to actual LSTM to keep dependencies FREE)
    """
    
    def __init__(self, lookback=60):
        self.lookback = lookback
        self.model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.scaler = MinMaxScaler()
        
    def prepare_sequences(self, data):
        """Prepare time series sequences"""
        X, y = [], []
        
        for i in range(self.lookback, len(data)):
            X.append(data[i-self.lookback:i])
            y.append(data[i])
        
        return np.array(X), np.array(y)
    
    def train(self, prices):
        """Train the model"""
        # Scale data
        scaled_data = self.scaler.fit_transform(prices.reshape(-1, 1)).flatten()
        
        # Prepare sequences
        X, y = self.prepare_sequences(scaled_data)
        
        # Train
        self.model.fit(X, y)
        
        return self.model.score(X, y)
    
    def predict(self, recent_prices, days=7):
        """Predict future prices"""
        # Scale recent prices
        scaled_prices = self.scaler.transform(recent_prices.reshape(-1, 1)).flatten()
        
        predictions = []
        current_sequence = scaled_prices[-self.lookback:]
        
        for _ in range(days):
            # Predict next value
            next_pred = self.model.predict(current_sequence.reshape(1, -1))[0]
            predictions.append(next_pred)
            
            # Update sequence
            current_sequence = np.append(current_sequence[1:], next_pred)
        
        # Inverse transform predictions
        predictions = self.scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten()
        
        return predictions
    
    def save(self, filepath):
        """Save model"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'lookback': self.lookback
        }, filepath)
    
    def load(self, filepath):
        """Load model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.scaler = data['scaler']
        self.lookback = data['lookback']
