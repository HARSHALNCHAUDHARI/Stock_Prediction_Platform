import pandas as pd
import numpy as np
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volatility import BollingerBands, AverageTrueRange

def calculate_all_indicators(df):
    """
    Calculate all technical indicators for stock data
    df must have columns: Open, High, Low, Close, Volume
    """
    close = df['Close']
    high = df['High']
    low = df['Low']
    
    indicators = {}
    
    # Moving Averages
    indicators['SMA_20'] = SMAIndicator(close=close, window=20).sma_indicator()
    indicators['SMA_50'] = SMAIndicator(close=close, window=50).sma_indicator()
    indicators['SMA_200'] = SMAIndicator(close=close, window=200).sma_indicator()
    indicators['EMA_12'] = EMAIndicator(close=close, window=12).ema_indicator()
    indicators['EMA_26'] = EMAIndicator(close=close, window=26).ema_indicator()
    
    # MACD
    macd = MACD(close=close)
    indicators['MACD'] = macd.macd()
    indicators['MACD_signal'] = macd.macd_signal()
    indicators['MACD_diff'] = macd.macd_diff()
    
    # RSI
    indicators['RSI'] = RSIIndicator(close=close, window=14).rsi()
    
    # Bollinger Bands
    bollinger = BollingerBands(close=close, window=20, window_dev=2)
    indicators['BB_upper'] = bollinger.bollinger_hband()
    indicators['BB_middle'] = bollinger.bollinger_mavg()
    indicators['BB_lower'] = bollinger.bollinger_lband()
    
    # Stochastic Oscillator
    stoch = StochasticOscillator(high=high, low=low, close=close)
    indicators['Stoch_K'] = stoch.stoch()
    indicators['Stoch_D'] = stoch.stoch_signal()
    
    # ATR (Average True Range)
    indicators['ATR'] = AverageTrueRange(high=high, low=low, close=close).average_true_range()
    
    # Volume indicators
    indicators['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
    
    return indicators

def get_trading_signals(df):
    """Generate trading signals based on indicators"""
    indicators = calculate_all_indicators(df)
    latest_idx = df.index[-1]
    
    signals = {
        'overall': 'NEUTRAL',
        'strength': 0,
        'indicators': {}
    }
    
    score = 0
    
    # RSI Signal
    rsi = indicators['RSI'].iloc[-1]
    if rsi > 70:
        signals['indicators']['RSI'] = 'OVERBOUGHT'
        score -= 1
    elif rsi < 30:
        signals['indicators']['RSI'] = 'OVERSOLD'
        score += 1
    else:
        signals['indicators']['RSI'] = 'NEUTRAL'
    
    # MACD Signal
    macd_diff = indicators['MACD_diff'].iloc[-1]
    if macd_diff > 0:
        signals['indicators']['MACD'] = 'BULLISH'
        score += 1
    else:
        signals['indicators']['MACD'] = 'BEARISH'
        score -= 1
    
    # Moving Average Signal
    close = df['Close'].iloc[-1]
    sma_50 = indicators['SMA_50'].iloc[-1]
    sma_200 = indicators['SMA_200'].iloc[-1]
    
    if pd.notna(sma_50) and pd.notna(sma_200):
        if close > sma_50 > sma_200:
            signals['indicators']['MA'] = 'STRONG_BULLISH'
            score += 2
        elif close > sma_50:
            signals['indicators']['MA'] = 'BULLISH'
            score += 1
        elif close < sma_50 < sma_200:
            signals['indicators']['MA'] = 'STRONG_BEARISH'
            score -= 2
        else:
            signals['indicators']['MA'] = 'BEARISH'
            score -= 1
    
    # Bollinger Bands Signal
    bb_upper = indicators['BB_upper'].iloc[-1]
    bb_lower = indicators['BB_lower'].iloc[-1]
    
    if close > bb_upper:
        signals['indicators']['BB'] = 'OVERBOUGHT'
        score -= 1
    elif close < bb_lower:
        signals['indicators']['BB'] = 'OVERSOLD'
        score += 1
    else:
        signals['indicators']['BB'] = 'NEUTRAL'
    
    # Overall signal
    signals['strength'] = score
    if score >= 3:
        signals['overall'] = 'STRONG_BUY'
    elif score >= 1:
        signals['overall'] = 'BUY'
    elif score <= -3:
        signals['overall'] = 'STRONG_SELL'
    elif score <= -1:
        signals['overall'] = 'SELL'
    else:
        signals['overall'] = 'NEUTRAL'
    
    return signals
