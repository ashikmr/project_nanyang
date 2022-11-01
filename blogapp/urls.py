# Custom blogapp url config.

from django.urls import path

# Import views
from . import views

urlpatterns = [
    path('', views.indexView, name='index'),
]
