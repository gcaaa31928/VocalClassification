from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader



def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())


def handle_uploaded_file(f):
    with open('some/file/name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)