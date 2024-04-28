from django.urls import path
from FeedBackApp import views

urlpatterns = [
    path('event/', views.EventDescriptionAPIView.as_view()),
    path('question/<int:event>/', views.QuestionAPIView.as_view()),
    path('question/<int:event>/<int:pk>/', views.QuestionAPIView.as_view()),
    path('answer/', views.AnswerViewSet.as_view()),
    path('answer/<int:user>/', views.AnswerAPIView.as_view()),
    path('answer/<int:user>/<int:pk>/', views.AnswerAPIView.as_view()),
    path('event/description/', views.EventDescriptionAPIView.as_view()),
]