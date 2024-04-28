from chat import views
from django.urls import path

urlpatterns = [
    path('', views.room, name='chat-page'),
]
