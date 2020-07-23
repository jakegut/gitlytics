from app import celery, create_app
from celery_utils import init_celery

init_celery(celery, create_app())