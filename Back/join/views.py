from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from registeration.models import User
from chatroom.models import Chatroom
from .models import Chatroom_User
from .serializer import JoinSerializer


@api_view(['POST'])
@permission_classes([])
def Join(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    user = User.objects.filter(id=data['id'][0])
    if list(user) == [] or list(chatroom) == []:
        return Response({'message': 'User or chatroom not found'})
    chatroom_user = Chatroom_User.objects.filter(user=user[0], chatroom=chatroom[0])
    if list(chatroom_user) != []:
        return Response({'message': 'User has joined'})
    chatroom_user = Chatroom_User.objects.create(user=user[0], chatroom=chatroom[0])
    chatroom_user.save()
    user[0].numberOfChatrooms +=1
    user[0].save()
    chatroom[0].numberOfUser += 1
    chatroom[0].save()
    return Response({'message': 'New chatroom_User created'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([])
def checkJoin(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    user = User.objects.filter(id=data['id'][0])
    if list(user) == [] or list(chatroom) == []:
        return Response({'message': 'User or chatroom not found'})
    chatroom_user = Chatroom_User.objects.filter(user=user[0], chatroom=chatroom[0])
    if list(chatroom_user) != []:
        return Response({'message': 'User has joined'})
    return Response({'message': 'user is not joined yet'})

@api_view(['POST'])
@permission_classes([])
def Left(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    user = User.objects.filter(id=data['id'][0])
    if list(user) == [] or list(chatroom) == []:
        return Response({'message': 'User or chatroom not found'})
    chatroom_user = Chatroom_User.objects.filter(user=user[0], chatroom=chatroom[0])
    if list(chatroom_user) == []:
        return Response({'message': 'User has not joined'})
    chatroom_user.delete()
    user[0].numberOfChatrooms -=1
    user[0].save()
    chatroom[0].numberOfUser -= 1
    chatroom[0].save()
    return Response({'message': 'chatroom_User deleted'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([])
def show_Users(request):
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    chatroom_user = Chatroom_User.objects.filter(chatroom=chatroom[0])
    data = []
    for i in range(len(chatroom_user)):
        data.append({'id': chatroom_user[i].user.id, 'name': chatroom_user[i].user.username})
    return Response(data, status=status.HTTP_200_OK)




