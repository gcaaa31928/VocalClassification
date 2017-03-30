from django.conf.urls import url
from django.views.generic import TemplateView

from sites import views

urlpatterns = [
    url(r'^$', views.index)
]