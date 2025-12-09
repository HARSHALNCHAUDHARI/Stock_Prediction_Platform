# backend/tasks/celery_app.py
from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    'stock_platform',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0',
    include=[
        'tasks.data_tasks',
        'tasks.ml_tasks',
        'tasks.report_tasks',
    ]
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)

celery_app.conf.beat_schedule = {
    'nightly-ml-predictions': {
        'task': 'tasks.ml_tasks.update_all_predictions',
        'schedule': crontab(hour=2, minute=0),  # 2 AM UTC
    },
    'daily-data-refresh': {
        'task': 'tasks.data_tasks.refresh_core_symbols',
        'schedule': crontab(hour=1, minute=0),  # 1 AM
    },
    'daily-email-report': {
        'task': 'tasks.report_tasks.send_daily_reports',
        'schedule': crontab(hour=3, minute=0),  # 3 AM
    },
}
