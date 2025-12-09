from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import yfinance as yf
import pandas as pd
from utils.indicators import calculate_all_indicators, get_trading_signals
from utils.risk_analysis import calculate_all_risk_metrics, get_risk_assessment
from utils.sentiment_analysis import get_stock_news_sentiment, get_sentiment_signal
from utils.regime_detection import detect_regime, risk_summary
from services.data_service import DataService


analysis_bp = Blueprint('analysis', __name__)


@analysis_bp.route('/summary/<symbol>', methods=['GET'])
@jwt_required()
def summary(symbol):
    """Return market regime + risk summary for a symbol."""
    try:
        symbol = symbol.upper()

        hist_data = DataService.fetch_historical_data(symbol, period='1y')
        if not hist_data:
            return jsonify({'error': 'No historical data available'}), 404

        df = pd.DataFrame(hist_data)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)

        regime, mean_ret, vol = detect_regime(df)
        risk = risk_summary(df)

        return jsonify({
            'symbol': symbol,
            'regime': regime,
            'recent_avg_return': float(mean_ret),
            'recent_volatility': float(vol),
            'risk': risk
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/indicators/<symbol>', methods=['GET'])
@jwt_required()
def get_technical_indicators(symbol):
    """Get technical indicators for a stock"""
    try:
        symbol = symbol.upper()
        period = request.args.get('period', '6mo')
        
        # Fetch stock data
        stock = yf.Ticker(symbol)
        df = stock.history(period=period)
        
        if df.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Calculate indicators
        indicators = calculate_all_indicators(df)
        
        # Get latest values
        latest_indicators = {}
        for key, series in indicators.items():
            if not series.empty:
                latest_indicators[key] = float(series.iloc[-1]) if pd.notna(series.iloc[-1]) else None
        
        # Get trading signals
        signals = get_trading_signals(df)
        
        # Prepare chart data (last 60 days)
        chart_data = []
        for i in range(max(0, len(df) - 60), len(df)):
            row = {
                'date': df.index[i].strftime('%Y-%m-%d'),
                'close': float(df['Close'].iloc[i]),
            }
            # Add indicator values for charts
            for key in ['SMA_20', 'SMA_50', 'BB_upper', 'BB_middle', 'BB_lower', 'RSI', 'MACD']:
                if key in indicators and i < len(indicators[key]):
                    val = indicators[key].iloc[i]
                    row[key] = float(val) if pd.notna(val) else None
            chart_data.append(row)
        
        return jsonify({
            'symbol': symbol,
            'indicators': latest_indicators,
            'signals': signals,
            'chart_data': chart_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/risk/<symbol>', methods=['GET'])
@jwt_required()
def get_risk_analysis(symbol):
    """Get risk metrics for a stock"""
    try:
        symbol = symbol.upper()
        period = request.args.get('period', '1y')
        
        # Fetch stock data
        stock = yf.Ticker(symbol)
        df = stock.history(period=period)
        
        if df.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Fetch market data (S&P 500 as benchmark)
        market = yf.Ticker('^GSPC')
        market_df = market.history(period=period)
        
        # Calculate risk metrics
        metrics = calculate_all_risk_metrics(
            df['Close'],
            market_df['Close'] if not market_df.empty else None
        )
        
        # Get risk assessment
        assessment = get_risk_assessment(metrics)
        
        # Calculate historical volatility chart data
        returns = df['Close'].pct_change().dropna()
        rolling_vol = returns.rolling(window=30).std() * (252 ** 0.5)
        
        volatility_chart = []
        for i in range(len(rolling_vol)):
            if pd.notna(rolling_vol.iloc[i]):
                volatility_chart.append({
                    'date': rolling_vol.index[i].strftime('%Y-%m-%d'),
                    'volatility': float(rolling_vol.iloc[i])
                })
        
        # Calculate drawdown chart
        cumulative = (1 + returns).cumprod()
        running_max = cumulative.cummax()
        drawdown = (cumulative - running_max) / running_max
        
        drawdown_chart = []
        for i in range(len(drawdown)):
            drawdown_chart.append({
                'date': drawdown.index[i].strftime('%Y-%m-%d'),
                'drawdown': float(drawdown.iloc[i])
            })
        
        return jsonify({
            'symbol': symbol,
            'metrics': metrics,
            'assessment': assessment,
            'charts': {
                'volatility': volatility_chart[-90:],  # Last 90 days
                'drawdown': drawdown_chart[-90:]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/sentiment/<symbol>', methods=['GET'])
@jwt_required()
def get_sentiment_analysis(symbol):
    """Get sentiment analysis from news"""
    try:
        symbol = symbol.upper()
        
        # Get stock info for company name
        stock = yf.Ticker(symbol)
        info = stock.info
        company_name = info.get('longName', symbol)
        
        # Get sentiment from news
        sentiment = get_stock_news_sentiment(symbol, company_name)
        
        if not sentiment:
            return jsonify({
                'symbol': symbol,
                'message': 'No recent news available',
                'overall_sentiment': 'NEUTRAL',
                'sentiment_score': 0
            }), 200
        
        # Get trading signal based on sentiment
        signal = get_sentiment_signal(sentiment)
        sentiment['trading_signal'] = signal
        
        return jsonify({
            'symbol': symbol,
            'company_name': company_name,
            'sentiment': sentiment
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/comprehensive/<symbol>', methods=['GET'])
@jwt_required()
def get_comprehensive_analysis(symbol):
    """Get comprehensive analysis combining all factors"""
    try:
        symbol = symbol.upper()
        
        # Get stock data
        stock = yf.Ticker(symbol)
        df = stock.history(period='6mo')
        info = stock.info
        
        if df.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Technical Analysis
        signals = get_trading_signals(df)
        
        # Risk Analysis
        metrics = calculate_all_risk_metrics(df['Close'])
        assessment = get_risk_assessment(metrics)
        
        # Sentiment Analysis
        company_name = info.get('longName', symbol)
        sentiment = get_stock_news_sentiment(symbol, company_name)
        sentiment_signal = get_sentiment_signal(sentiment) if sentiment else 'NEUTRAL'
        
        # Combine all signals
        score = 0
        
        # Technical score
        tech_score = signals['strength']
        score += tech_score
        
        # Sentiment score
        if sentiment:
            sent_score = sentiment['sentiment_score'] * 5  # Scale to match technical
            score += sent_score
        
        # Risk adjustment
        if metrics['sharpe_ratio'] > 1:
            score += 1
        elif metrics['sharpe_ratio'] < 0:
            score -= 1
        
        # Overall recommendation
        if score >= 4:
            recommendation = 'STRONG_BUY'
        elif score >= 2:
            recommendation = 'BUY'
        elif score <= -4:
            recommendation = 'STRONG_SELL'
        elif score <= -2:
            recommendation = 'SELL'
        else:
            recommendation = 'HOLD'
        
        return jsonify({
            'symbol': symbol,
            'company_name': company_name,
            'current_price': float(df['Close'].iloc[-1]),
            'recommendation': recommendation,
            'confidence_score': min(abs(score) / 10 * 100, 100),
            'technical': {
                'signal': signals['overall'],
                'strength': signals['strength'],
                'indicators': signals['indicators']
            },
            'risk': {
                'level': assessment['risk_level'],
                'sharpe_ratio': metrics['sharpe_ratio'],
                'volatility': metrics['volatility'],
                'max_drawdown': metrics['max_drawdown']
            },
            'sentiment': {
                'signal': sentiment_signal,
                'score': sentiment['sentiment_score'] if sentiment else 0,
                'articles_analyzed': sentiment['total_articles'] if sentiment else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/compare', methods=['POST'])
@jwt_required()
def compare_stocks():
    """Compare multiple stocks"""
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        
        if not symbols or len(symbols) < 2:
            return jsonify({'error': 'At least 2 symbols required'}), 400
        
        comparisons = []
        
        for symbol in symbols[:5]:  # Limit to 5 stocks
            symbol = symbol.upper()
            stock = yf.Ticker(symbol)
            df = stock.history(period='3mo')
            
            if df.empty:
                continue
            
            # Calculate metrics
            metrics = calculate_all_risk_metrics(df['Close'])
            signals = get_trading_signals(df)
            
            comparisons.append({
                'symbol': symbol,
                'current_price': float(df['Close'].iloc[-1]),
                'signal': signals['overall'],
                'sharpe_ratio': metrics['sharpe_ratio'],
                'volatility': metrics['volatility'],
                'max_drawdown': metrics['max_drawdown'],
                'avg_return': metrics['avg_return']
            })
        
        return jsonify({'comparisons': comparisons}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
