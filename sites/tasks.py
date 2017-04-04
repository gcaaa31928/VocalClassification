from __future__ import absolute_import, unicode_literals

import json

from celery import shared_task

from sites.keras.predict import Predict


@shared_task
def predict(audio_name):
    result = Predict.run(audio_name).tolist()
    print(type(result))
    return json.dumps(result)


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)