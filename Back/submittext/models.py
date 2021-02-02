from django.db import models
from registeration.models import User
from chatroom.models import Chatroom
import datetime
# Create your models here.
class Question(models.Model):
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True)
    chatroom = models.ForeignKey(Chatroom , on_delete=models.SET_NULL , null=True)
    text = models.TextField()
    time = models.DateTimeField()
    file = models.FileField(upload_to='question/file' , null=True)
    isAnswered = models.BooleanField(default=False)
    vote = models.IntegerField(default=0)

class Answer(models.Model):
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True)
    question = models.ForeignKey(Question , on_delete=models.SET_NULL , null=True)
    text = models.TextField()
    time = models.DateTimeField()
    file = models.FileField(upload_to='answer/file' , null=True)
    vote = models.IntegerField(default=0)
    isAccepted = models.BooleanField(default=False)

#'question feilds : owner — time — linkOfFile — picture — text — chatroom — IsAnswered -- CommonQuestion'
                                                 #'?'



class User_Question(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    question = models.ForeignKey(Question , on_delete=models.CASCADE)
    voteState = models.IntegerField(default=0)

class User_Answer(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer , on_delete=models.CASCADE)
    voteState = models.IntegerField(default=0)
