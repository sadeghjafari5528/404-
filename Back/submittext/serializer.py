from rest_framework import serializers
from .models import Answer , Question
from registeration.models import User


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id' , 'user', 'chatroom', 'text' , 'time' , 'file' , 'isAnswered' , 'vote']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id' , 'user', 'question' ,'text' , 'time' , 'file' , 'vote', 'isAccepted']

class ShowUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'askedQuestions' ,'answeredQuestions' , 'active' , 'numberOfChatrooms', 'description', 'interests', 'first_name', 'last_name', 'numberOfChatrooms']
