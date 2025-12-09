"""
Prophet-based forecasting model
"""
import pandas as pd
import numpy as np
from datetime import timedelta


class ProphetModel:
    """Wrapper for Prophet-like trend forecasting"""
    
    @staticmethod
    def predict(df, days=7):
        """
        Simple trend-based forecasting
        (Prophet requires specific install; this is a lightweight alternative)
        """
        try:
            close_prices = df['close'].values
            dates = df.index
            
            # Simple exponential smoothing
            alpha = 0.3
            smoothed = [close_prices[0]]
            for price in close_prices[1:]:
                smoothed.append(alpha * price + (1 - alpha) * smoothed[-1])
            
            # Trend from last 30 days
            recent = smoothed[-30:]
            x = np.arange(len(recent))
            z = np.polyfit(x, recent, 1)
            slope = z[0]
            
            last_price = smoothed[-1]
            predictions = []
            
            for i in range(1, days + 1):
                pred_price = last_price + (slope * i)
                predictions.append(float(pred_price))
            
            return np.array(predictions)
            
        except Exception as e:
            print(f"ProphetModel error: {e}")
            return None
