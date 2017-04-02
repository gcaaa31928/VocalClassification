from __future__ import absolute_import, unicode_literals
from celery import shared_task


@shared_task
def predict(audio_name):
    return 1


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)