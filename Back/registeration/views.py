from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
import datetime

from .models import User
from .serializer import AccountRegistrationSerializer, UserSigninSerializer


@api_view(['POST'])
@permission_classes([])
def signup(request):
    serializer = AccountRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.active = True
        user.last_login = datetime.datetime.now()
        data = {}
        data['id'] = user.id
        data['email'] = user.email
        data['username'] = user.username
        src = open('media/profile/image/default.txt', 'r')
        default = src.read()
        src.close()
        newsrc = open('media/profile/image/' + str(user.id) + '.txt', 'a')
        newsrc.write(default)
        newsrc.close()
        
        user.profile_picture = 'media/profile/image/' + str(user.id) + '.txt'
        return Response({'message': 'New user created' , 'user' : data}, status=status.HTTP_201_CREATED)
    return Response({'message':'user with this email address already exists.'})


@api_view(['POST'])
@permission_classes([])
def signin(request):
    if request.method == 'POST':
        post_data = dict(request.POST)
        check_user = User.objects.filter(email=post_data['email'][0])
        if len(check_user) == 0:
            return Response({"message":"this email does not exist!"} )
        else:
            if check_user[0].check_password(post_data['password'][0]):
                check_user[0].active = True
                check_user[0].last_login = datetime.datetime.now()
                serializer = UserSigninSerializer(check_user[0])
                data = serializer.data
                data['username'] = check_user[0].username
                return Response({"message":"wellcome" , 'user': data} , status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"message": "password or email is not correct"} )
