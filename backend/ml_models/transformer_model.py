"""
Transformer-style Model (Simplified with Random Forest)
"""
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import pandas as pd

class TransformerModel:
    """
    Simplified Transformer-style model using Random Forest
    """
    
    def __init__(self, n_features=10):
        self.n_features = n_features
        self.model = RandomForestRegressor(
            n_estimators=150,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
    
    def create_features(self, prices):
        """Create features from price series"""
        df = pd.DataFrame({'price': prices})
        
        # Moving averages
        df['MA5'] = df['price'].rolling(5).mean()
        df['MA10'] = df['price'].rolling(10).mean()
        df['MA20'] = df['price'].rolling(20).mean()
        
        # Momentum
        df['momentum'] = df['price'].diff(5)
        
        # Volatility
        df['volatility'] = df['price'].rolling(10).std()
        
        # Rate of change
        df['ROC'] = df['price'].pct_change(5)
        
        # Price position
        df['price_position'] = (df['price'] - df['MA20']) / df['MA20']
        
        # Lag features
        for i in range(1, 4):
            df[f'lag_{i}'] = df['price'].shift(i)
        
        return df.dropna()
    
    def train(self, prices):
        """Train the model"""
        # Create features
        df = self.create_features(prices)
        
        feature_cols = [col for col in df.columns if col != 'price']
        X = df[feature_cols].values
        y = df['price'].values
        
        # Scale
        X_scaled = self.scaler.fit_transform(X)
        
        # Train
        self.model.fit(X_scaled, y)
        
        return self.model.score(X_scaled, y)
    
    def predict(self, prices, days=7):
        """Predict future prices"""
        predictions = []
        current_prices = prices.copy()
        
        for _ in range(days):
            # Create features
            df = self.create_features(current_prices)
            
            feature_cols = [col for col in df.columns if col != 'price']
            X = df[feature_cols].iloc[-1:].values
            
            # Scale and predict
            X_scaled = self.scaler.transform(X)
            pred = self.model.predict(X_scaled)[0]
            
            predictions.append(pred)
            current_prices = np.append(current_prices, pred)
        
        return np.array(predictions)
    
    def save(self, filepath):
        """Save model"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler
        }, filepath)
    
    def load(self, filepath):
        """Load model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.scaler = data['scaler']
