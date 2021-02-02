from django.db import models
from registeration.models import User
from chatroom.models import Chatroom


class Message(models.Model):
    chatroom = models.ForeignKey(Chatroom, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    parentMessage = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    time = models.DateTimeField(db_index=True)
