from django.shortcuts import render
from rest_framework import generics, viewsets

from .models import Event, Question, Answer, EventDescription
from .serializers import EventSerializers, QuestionSerializers, AnswerSerializers, EventDescriptionSerializers, \
    AnswerUpdateSerializers, AnswerUserSerializers


class EventAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializers


class EventDescriptionAPIView(generics.ListAPIView):
    queryset = EventDescription.objects.all()
    serializer_class = EventDescriptionSerializers


class QuestionAPIView(generics.ListAPIView):
    serializer_class = QuestionSerializers

    def get_queryset(self):
        if 'pk' in self.kwargs.keys():
            return Question.objects.filter(event=self.kwargs['event'], pk=self.kwargs['pk'])
        return Question.objects.filter(event=self.kwargs['event'])



class AnswerAPIView(generics.ListAPIView):
    serializer_class = AnswerUserSerializers

    def get_queryset(self):
        if 'pk' in self.kwargs.keys():
            return Answer.objects.filter(user=self.kwargs['user'], pk=self.kwargs['pk'])
        return Answer.objects.filter(user=self.kwargs['user'])


class AnswerViewSet(generics.CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializers