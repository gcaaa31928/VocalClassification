"""
WSGI config for vocal_classification project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

import sys
from django.core.wsgi import get_wsgi_application

sys.path.append('/root/work/VocalClassification/vocal_classification')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vocal_classification.settings")
application = get_wsgi_application()
