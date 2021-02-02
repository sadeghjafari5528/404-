from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.http import FileResponse
from mysite import settings 
from django.conf.urls.static import static
import os

from registeration.models import User
from .serializer import (PersonalInfoSerializer,
                        InterestsInfoSerializer,
)

@api_view(['POST' , ])
def show_personal_info(request):
    if request.method == 'POST':
        data = dict(request.POST)
        user = User.objects.get(id=data['id'][0])
        serializer = PersonalInfoSerializer(user)
        return Response(serializer.data) 

@api_view(['POST' , ])
def get_personal_info(request):
    if request.method == 'POST':
        data = dict(request.POST)
        user = User.objects.get(id=data['id'][0])
        if 'first_name' in data.keys():
            user.first_name = data['first_name'][0]
        if 'last_name' in data.keys():
            user.last_name = data['last_name'][0]
        if 'username' in data.keys():
            if list(User.objects.filter(username=data['username'][0])) == []:
                user.username = data['username'][0]
            else:
                if user.username != data['username'][0]:
                    return Response({'message': 'This username already exist'})

        if 'email' in data.keys():
            if list(User.objects.filter(email=data['email'][0])) == []:
                user.email = data['email'][0]
            else:
                if user.email != data['email'][0]:
                    return Response({'message': 'This email already exist'} )
        user.save()
        serializer = PersonalInfoSerializer(user)
        return Response(serializer.data , status=status.HTTP_200_OK)

@api_view(['GET' , ])
def show_activity(request):
    pass

@api_view(['POST' , ])
def show_interests(request):
    data = dict(request.POST)
    user = User.objects.filter(id=data['id'][0])
    if list(user) != []:
        user = user[0]
        serializer = InterestsInfoSerializer(user)
        data = serializer.data
        filename = user.cvfile
        if str(filename) != '':
            data['downloadlink'] = 'http://127.0.0.1:8000/media/' + str(filename)
        else:
            data['downloadlink'] = 'Does not exist file'
        return Response(data)
    return Response({'message': 'User not found'})

@api_view(['POST' , ])
def edit_interests(request):
    fileChanged = False
    data = dict(request.POST)
    s = {}
    user = User.objects.filter(id=data['id'][0])
    if user != []:
        user = user[0]
        if 'description' in data.keys():
            user.description = data['description'][0]
        if 'cvfile' in request.FILES.keys():
            file = request.FILES['cvfile']
            user.cvfile = file
        if 'interests' in data.keys():
            user.interests = data['interests'][0]
        user.save()
        return Response({'message': 'Edit user interest'}, status=status.HTTP_200_OK)

@api_view(['POST' , ])
def show_profile_picture(request):
    data = dict(request.POST)
    # print("############",data['id'],"##################")
    if data['id'][0]=='no id':
        # print("###########################################################")
        filename = 'media/profile/image/default.txt'
        data = open(filename, 'rb').read()
        return Response ({'Base64' : data})
    else:
        user = User.objects.filter(id=data['id'][0])
        if user != []:
            user = user[0]
            filename = 'media/profile/image/' + str(user.id) + '.txt'
            data = open(filename, 'rb').read()
            return Response ({'Base64' : data})


@api_view(['POST' , ])
def edit_profile_picture(request):
    data = dict(request.POST)
    user = User.objects.filter(id=data['id'][0])
    if user != []:
        user = user[0]
        if 'Base64' in request.POST.keys():
            filename = 'media/profile/image/' + str(user.id) + '.txt'
            data = open(filename, 'w')
            data.write(request.POST['Base64'])
            data.close()
            data = open(filename, 'r')
        user.save()
        return Response({'message': 'Edit user profile picture '}, status=status.HTTP_200_OK)
