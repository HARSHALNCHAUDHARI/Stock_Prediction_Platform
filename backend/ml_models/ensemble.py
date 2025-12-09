"""
Ensemble Model - Combines multiple models for better predictions
"""
import numpy as np
from .lstm_model import LSTMModel
from .transformer_model import TransformerModel
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
import joblib

class EnsembleModel:
    """
    Ensemble model combining multiple prediction models
    """
    
    def __init__(self):
        self.lstm = LSTMModel(lookback=30)
        self.transformer = TransformerModel()
        self.rf = RandomForestRegressor(n_estimators=100, random_state=42)
        self.gb = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.ridge = Ridge(alpha=1.0)
        
        self.models = {
            'lstm': self.lstm,
            'transformer': self.transformer,
            'random_forest': self.rf,
            'gradient_boosting': self.gb,
            'ridge': self.ridge
        }
        
        self.weights = {
            'lstm': 0.3,
            'transformer': 0.3,
            'random_forest': 0.2,
            'gradient_boosting': 0.15,
            'ridge': 0.05
        }
    
    def train(self, prices):
        """Train all models"""
        scores = {}
        
        # Train LSTM
        try:
            scores['lstm'] = self.lstm.train(prices)
            print(f"✅ LSTM Score: {scores['lstm']:.4f}")
        except Exception as e:
            print(f"❌ LSTM training failed: {str(e)}")
            scores['lstm'] = 0
        
        # Train Transformer
        try:
            scores['transformer'] = self.transformer.train(prices)
            print(f"✅ Transformer Score: {scores['transformer']:.4f}")
        except Exception as e:
            print(f"❌ Transformer training failed: {str(e)}")
            scores['transformer'] = 0
        
        # Train simple models with basic features
        try:
            X = np.arange(len(prices)).reshape(-1, 1)
            y = prices
            
            self.rf.fit(X, y)
            scores['random_forest'] = self.rf.score(X, y)
            print(f"✅ Random Forest Score: {scores['random_forest']:.4f}")
            
            self.gb.fit(X, y)
            scores['gradient_boosting'] = self.gb.score(X, y)
            print(f"✅ Gradient Boosting Score: {scores['gradient_boosting']:.4f}")
            
            self.ridge.fit(X, y)
            scores['ridge'] = self.ridge.score(X, y)
            print(f"✅ Ridge Score: {scores['ridge']:.4f}")
            
        except Exception as e:
            print(f"❌ Simple models training failed: {str(e)}")
        
        return scores
    
    def predict(self, prices, days=7):
        """Predict using ensemble of all models"""
        all_predictions = {}
        
        # LSTM predictions
        try:
            all_predictions['lstm'] = self.lstm.predict(prices, days)
        except:
            all_predictions['lstm'] = np.full(days, prices[-1])
        
        # Transformer predictions
        try:
            all_predictions['transformer'] = self.transformer.predict(prices, days)
        except:
            all_predictions['transformer'] = np.full(days, prices[-1])
        
        # Simple model predictions
        try:
            X_future = np.arange(len(prices), len(prices) + days).reshape(-1, 1)
            all_predictions['random_forest'] = self.rf.predict(X_future)
            all_predictions['gradient_boosting'] = self.gb.predict(X_future)
            all_predictions['ridge'] = self.ridge.predict(X_future)
        except:
            all_predictions['random_forest'] = np.full(days, prices[-1])
            all_predictions['gradient_boosting'] = np.full(days, prices[-1])
            all_predictions['ridge'] = np.full(days, prices[-1])
        
        # Weighted average ensemble
        final_predictions = np.zeros(days)
        
        for model_name, predictions in all_predictions.items():
            final_predictions += predictions * self.weights[model_name]
        
        return final_predictions
    
    def save(self, directory):
        """Save all models"""
        import os
        os.makedirs(directory, exist_ok=True)
        
        self.lstm.save(os.path.join(directory, 'lstm.pkl'))
        self.transformer.save(os.path.join(directory, 'transformer.pkl'))
        joblib.dump(self.rf, os.path.join(directory, 'rf.pkl'))
        joblib.dump(self.gb, os.path.join(directory, 'gb.pkl'))
        joblib.dump(self.ridge, os.path.join(directory, 'ridge.pkl'))
    
    def load(self, directory):
        """Load all models"""
        import os
        
        self.lstm.load(os.path.join(directory, 'lstm.pkl'))
        self.transformer.load(os.path.join(directory, 'transformer.pkl'))
        self.rf = joblib.load(os.path.join(directory, 'rf.pkl'))
        self.gb = joblib.load(os.path.join(directory, 'gb.pkl'))
        self.ridge = joblib.load(os.path.join(directory, 'ridge.pkl'))
