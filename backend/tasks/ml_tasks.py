# backend/tasks/ml_tasks.py
from datetime import datetime
from .celery_app import celery_app
from services.data_service import DataService
from services.ml_service import MLService
from config.database import db, PredictionHistory


WATCHLIST_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA']


@celery_app.task
def update_all_predictions():
    """
    Nightly task: train/refresh predictions for key symbols and store in PredictionHistory.
    """
    print(f"[ml_tasks] Starting nightly prediction update at {datetime.utcnow().isoformat()}")

    updated = 0
    for symbol in WATCHLIST_SYMBOLS:
        try:
            df = DataService.fetch_historical_data(symbol, period='6mo')
            preds = MLService.predict(symbol, df, days=7)

            if not preds:
                print(f"[ml_tasks] No predictions for {symbol}")
                continue

            # Expecting preds to be a single value or dict; adapt as needed
            if isinstance(preds, dict):
                predicted_price = preds.get('predicted_price', 0.0)
                model_used = preds.get('model_used')
                confidence = preds.get('confidence_score')
                direction = preds.get('direction')
            elif isinstance(preds, (list, tuple)) and preds:
                first = preds[0]
                if isinstance(first, dict):
                    predicted_price = first.get('predicted_price', 0.0)
                    model_used = first.get('model_used')
                    confidence = first.get('confidence_score')
                    direction = first.get('direction')
                else:
                    predicted_price = float(first)
                    model_used = 'NightlyBatch'
                    confidence = None
                    direction = None
            else:
                predicted_price = float(preds)
                model_used = 'NightlyBatch'
                confidence = None
                direction = None

            # Create new history row (your model does not have `predictions` or `updated_at` columns)
            record = PredictionHistory(
                user_id=1,                      # default / system user
                symbol=symbol,
                prediction_date=datetime.utcnow(),
                predicted_price=predicted_price,
                actual_price=None,
                model_used=model_used,
                confidence_score=confidence,
                direction=direction,
            )
            db.session.add(record)
            db.session.commit()

            updated += 1
            print(f"[ml_tasks] Updated predictions for {symbol}")

        except Exception as e:
            db.session.rollback()
            print(f"[ml_tasks] Error on {symbol}: {str(e)[:120]}")

    print(f"[ml_tasks] Completed. Updated {updated} symbols.")
    return {"updated": updated}
