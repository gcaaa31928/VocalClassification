import json
import os
import uuid

from celery.result import AsyncResult
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader
from django_celery_results.managers import TaskResultManager

from sites.tasks import mul, predict
from vocal_classification.settings import AUDIO_DIR


def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())


def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']
        print(file.size)
        if file.size >= 6 * (10 ** 8):
            return HttpResponse(status=400)
        if 'audio' in file.content_type:
            response = handle_uploaded_file(request.FILES['file'])
            return JsonResponse(response)
        return HttpResponse(status=400)


def predict_result(request):
    if request.method != 'GET':
        return HttpResponse(status=404)
    task_id = request.GET['task_id']
    result = AsyncResult(task_id)
    result_data = dict()
    if result is None:
        return HttpResponse(status=400)
    if result.ready():
        result_data['data'] = json.loads(result.result)
        return JsonResponse(result_data)
    return HttpResponse(status=204)


def test(request):
    res = mul.delay(2, 2)


def handle_uploaded_file(f):
    name = str(uuid.uuid1())
    response = dict()
    with open(os.path.join(AUDIO_DIR, name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    response['name'] = name
    task_result = predict.delay(name)
    response['task_id'] = task_result.id
    return response
