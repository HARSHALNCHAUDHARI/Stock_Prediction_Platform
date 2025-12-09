# backend/tasks/__init__.py
from .celery_app import celery_app  # so "from tasks import celery_app" works
