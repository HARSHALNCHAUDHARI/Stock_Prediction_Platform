import numpy as np
import pandas as pd


def compute_returns(df: pd.DataFrame):
    """Add daily returns column to DataFrame."""
    data = df.copy()
    data['return'] = data['close'].pct_change()
    data = data.dropna()
    return data


def detect_regime(df: pd.DataFrame, lookback: int = 60):
    """
    Very simple market regime classifier using recent trend + volatility.

    Returns one of: 'bull', 'bear', 'sideways', 'high_vol'
    """
    data = compute_returns(df)

    if len(data) < lookback:
        lookback = len(data)

    recent = data.iloc[-lookback:]

    # Average return and volatility
    mean_ret = recent['return'].mean()
    vol = recent['return'].std()

    # Thresholds (tunable)
    trend_up = 0.001     # 0.1% avg daily up
    trend_down = -0.001  # -0.1% avg daily down
    high_vol = 0.02      # 2% daily std

    if vol > high_vol:
        return 'high_vol', mean_ret, vol

    if mean_ret > trend_up:
        return 'bull', mean_ret, vol
    elif mean_ret < trend_down:
        return 'bear', mean_ret, vol
    else:
        return 'sideways', mean_ret, vol


def max_drawdown(series: pd.Series):
    """Maximum drawdown of a price or equity curve series."""
    roll_max = series.cummax()
    drawdown = (series - roll_max) / roll_max
    return float(drawdown.min())


def sharpe_ratio(returns: pd.Series, risk_free: float = 0.0):
    """Simple daily Sharpe, assuming risk_free is daily."""
    excess = returns - risk_free
    if excess.std() == 0:
        return 0.0
    return float(excess.mean() / excess.std() * np.sqrt(252))


def risk_summary(df: pd.DataFrame):
    """
    Compute high-level risk metrics from historical prices:
    - volatility_30d
    - volatility_90d
    - sharpe_90d
    - max_drawdown
    """
    data = compute_returns(df)

    if data.empty:
        return {
            'volatility_30d': None,
            'volatility_90d': None,
            'sharpe_90d': None,
            'max_drawdown': None,
        }

    # Volatility (daily std)
    vol_30 = float(data['return'].tail(30).std()) if len(data) >= 30 else None
    vol_90 = float(data['return'].tail(90).std()) if len(data) >= 90 else None

    # Sharpe (90 days)
    sharpe_90 = None
    if len(data) >= 90:
        sharpe_90 = sharpe_ratio(data['return'].tail(90))

    # Max drawdown over full period
    mdd = max_drawdown(df['close'])

    return {
        'volatility_30d': vol_30,
        'volatility_90d': vol_90,
        'sharpe_90d': sharpe_90,
        'max_drawdown': mdd,
    }
