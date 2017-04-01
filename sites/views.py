import os
import uuid

from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader

from sites.tasks import mul
from vocal_classification.settings import AUDIO_DIR


def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())


def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']
        print(file.size)
        if file.size >= 6 * (10 ** 6):
            return HttpResponse(status=400)
        if 'audio' in file.content_type:
            response = handle_uploaded_file(request.FILES['file'])
            return JsonResponse(response)
        return HttpResponse(status=400)


def test(request):
    res = mul.delay(2, 2)


def handle_uploaded_file(f):
    name = str(uuid.uuid1())
    response = dict()
    response['name'] = name
    with open(os.path.join(AUDIO_DIR, name), 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return response
