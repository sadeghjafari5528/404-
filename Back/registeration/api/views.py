from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from registeration.api.serializer import RegisterationSerializer

@api_view(['POST',])
def signup(request):
    if request.method == 'POST':
        serializer = RegisterationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = "successfully signup a new user"
            data['email'] = user.email
        else:
            data = serializer.errors
        return Response(data)