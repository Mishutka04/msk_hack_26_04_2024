from django.contrib.auth.models import AbstractUser
from django.db import models

NAME_EVENT = (('Сессия', 'Сессия'),
              ('Лекция', 'Лекция'),
              ('Вебинар', 'Вебинар'))


class User(AbstractUser):
    pass


class Event(models.Model):
    type = models.CharField(choices=NAME_EVENT, max_length=100)

    def __str__(self):
        return self.type


class EventDescription(models.Model):
    name = models.CharField(max_length=100)
    data = models.DateField(auto_now_add=True)
    description = models.CharField(max_length=250)
    event = models.ForeignKey('Event', on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=200)
    event = models.ForeignKey('EventDescription', on_delete=models.PROTECT)

    def __str__(self):
        return self.question


class Answer(models.Model):
    answer = models.CharField(max_length=500)
    informative = models.BooleanField(default=False)
    positive = models.BooleanField(default=False)
    objects_class = models.IntegerField(blank=True, default=0)
    question = models.ForeignKey('Question', on_delete=models.PROTECT)
    user = models.ForeignKey('User', on_delete=models.PROTECT)

    def __str__(self):
        return self.answer





# Create your models here.