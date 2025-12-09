import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timedelta
import re

# Initialize VADER
analyzer = SentimentIntensityAnalyzer()

def clean_text(text):
    """Clean text for sentiment analysis"""
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.strip()

def analyze_sentiment(text):
    """Analyze sentiment of text using VADER"""
    if not text:
        return {'compound': 0, 'label': 'NEUTRAL'}
    
    cleaned = clean_text(text)
    scores = analyzer.polarity_scores(cleaned)
    
    compound = scores['compound']
    if compound >= 0.05:
        label = 'POSITIVE'
    elif compound <= -0.05:
        label = 'NEGATIVE'
    else:
        label = 'NEUTRAL'
    
    return {
        'compound': compound,
        'positive': scores['pos'],
        'negative': scores['neg'],
        'neutral': scores['neu'],
        'label': label
    }

def get_stock_news_sentiment(symbol, company_name):
    """Get sentiment from news headlines"""
    try:
        query = f"{symbol} {company_name} stock"
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return None
        
        import xml.etree.ElementTree as ET
        root = ET.fromstring(response.content)
        
        headlines = []
        for item in root.findall('.//item')[:10]:
            title = item.find('title')
            if title is not None and title.text:
                headlines.append(title.text)
        
        if not headlines:
            return None
        
        sentiments = [analyze_sentiment(headline) for headline in headlines]
        avg_compound = sum(s['compound'] for s in sentiments) / len(sentiments)
        
        positive_count = sum(1 for s in sentiments if s['label'] == 'POSITIVE')
        negative_count = sum(1 for s in sentiments if s['label'] == 'NEGATIVE')
        neutral_count = sum(1 for s in sentiments if s['label'] == 'NEUTRAL')
        
        overall_label = 'NEUTRAL'
        if avg_compound >= 0.05:
            overall_label = 'POSITIVE'
        elif avg_compound <= -0.05:
            overall_label = 'NEGATIVE'
        
        return {
            'overall_sentiment': overall_label,
            'sentiment_score': avg_compound,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'total_articles': len(headlines),
            'headlines': [
                {
                    'title': headlines[i],
                    'sentiment': sentiments[i]['label'],
                    'score': sentiments[i]['compound']
                }
                for i in range(len(headlines))
            ]
        }
        
    except Exception as e:
        print(f"Error fetching news sentiment: {e}")
        return None

def get_sentiment_signal(sentiment_data):
    """Convert sentiment to trading signal"""
    if not sentiment_data:
        return 'NEUTRAL'
    
    score = sentiment_data['sentiment_score']
    
    if score >= 0.3:
        return 'STRONG_BULLISH'
    elif score >= 0.1:
        return 'BULLISH'
    elif score <= -0.3:
        return 'STRONG_BEARISH'
    elif score <= -0.1:
        return 'BEARISH'
    else:
        return 'NEUTRAL'
