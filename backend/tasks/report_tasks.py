# backend/tasks/report_tasks.py
from datetime import datetime
from .celery_app import celery_app

@celery_app.task
def send_daily_reports():
  """
  Stub: later you can generate daily email/summary reports.
  Currently just logs.
  """
  print(f"[report_tasks] Daily reports task triggered at {datetime.utcnow().isoformat()}")
  return {"status": "ok"}
