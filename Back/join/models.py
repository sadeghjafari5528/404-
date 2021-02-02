from django.db import models
from registeration.models import User
from chatroom.models import Chatroom
from PIL import Image


class Chatroom_User(models.Model):
    chatroom = models.ForeignKey(Chatroom ,on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)