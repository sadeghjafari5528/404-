from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from chatroom.models import Chatroom
from .models import Message
import datetime


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })


@api_view(['POST'])
def show_Message(request):
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    message = Message.objects.filter(chatroom=chatroom[0])
    datalist = []
    for i in range(len(message)):
        data = {
            'user': message[i].user.id,
            'message_id': message[i].id,
            'username': message[i].user.username,
            'text': message[i].text,
            'time': message[i].time.ctime(),
        }
        if message[i].parentMessage:
            # if message[i].id == None:
            data['replyTo'] = message[i].parentMessage.id
        datalist.append(data)
    return Response(datalist, status=status.HTTP_200_OK)
