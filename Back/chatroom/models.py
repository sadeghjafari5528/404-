from django.db import models
from registeration.models import User
from PIL import Image


class Chatroom(models.Model):
    TOPIC_CHOICES = (
        ('App', 'App'),
        ('OS', 'OS'),
        ('PL', 'PL'),
    )
    owner = models.ForeignKey(User, on_delete=models.SET_NULL , null=True)
    selectedTopic = models.CharField(max_length=3, choices=TOPIC_CHOICES, null=True)
    Link = models.URLField(blank=True, null=True)
    Description = models.CharField(max_length=100, null=True)
    selectedSub = models.CharField(max_length=100, null=True)
    chatroomAvatar = models.FileField(upload_to="chatroom/image")
    chatroomName = models.CharField(max_length=100, null=True)
    selected = models.CharField(max_length=100, null=True)
    numberOfUser = models.IntegerField(default=1)

