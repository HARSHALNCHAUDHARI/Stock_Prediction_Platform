# backend/tasks/data_tasks.py
from datetime import datetime
from .celery_app import celery_app
from services.data_service import DataService

CORE_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA']

@celery_app.task
def refresh_core_symbols():
  """
  Scheduled task: refresh historical data for core symbols.
  """
  print(f"[data_tasks] Refreshing core symbols at {datetime.utcnow().isoformat()}")

  for symbol in CORE_SYMBOLS:
    try:
      # You already use yfinance inside DataService
      DataService.fetch_historical_data(symbol, period='6mo', store_in_db=True)
      print(f"[data_tasks] Updated data for {symbol}")
    except Exception as e:
      print(f"[data_tasks] Failed for {symbol}: {str(e)[:120]}")
