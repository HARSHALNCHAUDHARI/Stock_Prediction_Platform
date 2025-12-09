# backend/services/task_service.py
from tasks.celery_app import celery_app
from tasks.ml_tasks import update_all_predictions
from tasks.data_tasks import refresh_core_symbols

class TaskService:
  @staticmethod
  def trigger_full_refresh():
    """
    Manually trigger data + prediction refresh (e.g., from admin API).
    """
    refresh_core_symbols.delay()
    update_all_predictions.delay()
    return {"status": "queued"}

  @staticmethod
  def enqueue_prediction_update(symbols):
    """
    Queue ML prediction updates for specific symbols.
    """
    for symbol in symbols:
      # Optionally you can define a symbol-specific task
      update_all_predictions.delay()
