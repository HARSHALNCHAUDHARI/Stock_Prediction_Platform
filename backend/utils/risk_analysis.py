import numpy as np
import pandas as pd
from scipy import stats

def calculate_returns(prices):
    """Calculate daily returns"""
    return prices.pct_change().dropna()

def calculate_var(returns, confidence_level=0.95):
    """Calculate Value at Risk (VaR)"""
    var = np.percentile(returns, (1 - confidence_level) * 100)
    return var

def calculate_cvar(returns, confidence_level=0.95):
    """Calculate Conditional Value at Risk (CVaR)"""
    var = calculate_var(returns, confidence_level)
    cvar = returns[returns <= var].mean()
    return cvar

def calculate_sharpe_ratio(returns, risk_free_rate=0.02):
    """Calculate Sharpe Ratio"""
    excess_returns = returns - (risk_free_rate / 252)  # Daily risk-free rate
    sharpe = np.sqrt(252) * (excess_returns.mean() / excess_returns.std())
    return sharpe

def calculate_sortino_ratio(returns, risk_free_rate=0.02):
    """Calculate Sortino Ratio (only considers downside volatility)"""
    excess_returns = returns - (risk_free_rate / 252)
    downside_returns = returns[returns < 0]
    downside_std = downside_returns.std()
    
    if downside_std == 0:
        return 0
    
    sortino = np.sqrt(252) * (excess_returns.mean() / downside_std)
    return sortino

def calculate_max_drawdown(prices):
    """Calculate Maximum Drawdown"""
    cumulative = (1 + prices.pct_change()).cumprod()
    running_max = cumulative.cummax()
    drawdown = (cumulative - running_max) / running_max
    max_dd = drawdown.min()
    return max_dd

def calculate_beta(stock_returns, market_returns):
    """Calculate Beta (systematic risk)"""
    covariance = np.cov(stock_returns, market_returns)[0][1]
    market_variance = np.var(market_returns)
    beta = covariance / market_variance
    return beta

def calculate_volatility(returns):
    """Calculate annualized volatility"""
    volatility = returns.std() * np.sqrt(252)
    return volatility

def calculate_all_risk_metrics(prices, market_prices=None):
    """Calculate all risk metrics"""
    returns = calculate_returns(prices)
    
    metrics = {
        'var_95': float(calculate_var(returns, 0.95)),
        'var_99': float(calculate_var(returns, 0.99)),
        'cvar_95': float(calculate_cvar(returns, 0.95)),
        'sharpe_ratio': float(calculate_sharpe_ratio(returns)),
        'sortino_ratio': float(calculate_sortino_ratio(returns)),
        'max_drawdown': float(calculate_max_drawdown(prices)),
        'volatility': float(calculate_volatility(returns)),
        'avg_return': float(returns.mean()),
        'std_return': float(returns.std()),
    }
    
    # Calculate beta if market data provided
    if market_prices is not None:
        market_returns = calculate_returns(market_prices)
        # Align the indices
        common_index = returns.index.intersection(market_returns.index)
        if len(common_index) > 0:
            metrics['beta'] = float(calculate_beta(
                returns.loc[common_index],
                market_returns.loc[common_index]
            ))
    
    return metrics

def get_risk_assessment(metrics):
    """Provide risk assessment based on metrics"""
    assessment = {
        'risk_level': 'MODERATE',
        'recommendation': '',
        'warnings': []
    }
    
    # Assess volatility
    volatility = metrics['volatility']
    if volatility > 0.4:
        assessment['risk_level'] = 'HIGH'
        assessment['warnings'].append('High volatility detected')
    elif volatility < 0.15:
        assessment['risk_level'] = 'LOW'
    
    # Assess Sharpe ratio
    sharpe = metrics['sharpe_ratio']
    if sharpe > 2:
        assessment['recommendation'] = 'Excellent risk-adjusted returns'
    elif sharpe > 1:
        assessment['recommendation'] = 'Good risk-adjusted returns'
    elif sharpe < 0:
        assessment['recommendation'] = 'Poor risk-adjusted returns'
        assessment['warnings'].append('Negative Sharpe ratio')
    
    # Assess max drawdown
    max_dd = abs(metrics['max_drawdown'])
    if max_dd > 0.3:
        assessment['warnings'].append(f'Large maximum drawdown: {max_dd:.1%}')
    
    return assessment
