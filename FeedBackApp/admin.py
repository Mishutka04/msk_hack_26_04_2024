from django.contrib import admin

from .models import Event, Question, Answer, EventDescription

admin.site.register(Event)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(EventDescription)
# Register your models here.