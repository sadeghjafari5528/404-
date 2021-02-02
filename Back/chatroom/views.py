from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from registeration.models import User
from .models import Chatroom 
from join.models import Chatroom_User
from .serializers import ShowUChatroomProfileSerializer


@api_view(['POST'])
def createchatroom(request):
    data = dict(request.POST)
    user = User.objects.filter(id=data['owner'][0])
    Topic = data["selectedTopic"][0]
    if Topic == "PL":
        chatroom = Chatroom.objects.create(
            owner=user[0],
            selectedTopic=data['selectedTopic'][0],
            chatroomName=data['chatroomName'][0],
            Link=data['Link'][0],
            selected=data['selected'][0]
        )
        chatroom_user = Chatroom_User.objects.create(chatroom=chatroom,user=user[0])
        chatroom_user.save()
        if "Description" in request.data.keys() :
            Description=data['Description'][0]
        chatroom.save()
        if "Base64" in request.data.keys() :
            base64=data['Base64'][0] 
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(base64)
            newsrc.close()
        else :
            src = open('media/chatroom/image/default.txt', 'r')
            default = src.read()
            src.close()
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(default)
            newsrc.close()
        
        chatroom.chatroomAvatar = 'media/chatroom/image/' + str(chatroom.id) + '.txt'
        chatroom.save()
        print(chatroom.chatroomAvatar)
        return Response({'message': 'New chatroom created'}, status=status.HTTP_201_CREATED)
    if Topic == "OS":
        chatroom = Chatroom.objects.create(
            owner=user[0],
            selectedTopic=data['selectedTopic'][0],
            chatroomName=data['chatroomName'][0],
            selected=data['selected'][0],
            selectedSub=data['selectedSub'][0]
        )
        chatroom_user = Chatroom_User.objects.create(chatroom=chatroom,user=user[0])
        chatroom_user.save()
        if "Description" in request.data.keys() :
            Description=data['Description'][0]
        chatroom.save()
        if "Base64" in request.data.keys() :
            base64=data['Base64'][0] 
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(base64)
            newsrc.close()
        else :
            src = open('media/chatroom/image/default.txt', 'r')
            default = src.read()
            src.close()
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(default)
            newsrc.close()
        
        chatroom.chatroomAvatar = 'media/chatroom/image/' + str(chatroom.id) + '.txt'
        chatroom.save()
        return Response({'message': 'New chatroom created'}, status=status.HTTP_201_CREATED)
    if Topic == "App":
        chatroom = Chatroom.objects.create(
            owner=user[0],
            selectedTopic=data['selectedTopic'][0],
            chatroomName=data['chatroomName'][0],
            Link=data['Link'][0]
        )
        chatroom_user = Chatroom_User.objects.create(chatroom=chatroom,user=user[0])
        chatroom_user.save()
        if "Description" in request.data.keys() :
            Description=data['Description'][0]
        chatroom.save()
        if "Base64" in request.data.keys() :
            base64=data['Base64'][0] 
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(base64)
            newsrc.close()
        else :
            src = open('media/chatroom/image/default.txt', 'r')
            default = src.read()
            src.close()
            newsrc = open('media/chatroom/image/' + str(chatroom.id) + '.txt', 'a')
            newsrc.write(default)
            newsrc.close()
        
        chatroom.chatroomAvatar = 'media/chatroom/image/' + str(chatroom.id) + '.txt'
        chatroom.save()
        user[0].numberOfChatrooms += 1
        user[0].save()
        chatroom_user = Chatroom_User.objects.create(user=user[0] , chatroom=chatroom)
        return Response({'message': 'New chatroom created'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def show_chatrooms(request):
    user = User.objects.filter(id=request.data["user_id"])
    chatroom_user = Chatroom_User.objects.filter(user=user[0])
    data = []
    for i in range(len(chatroom_user)):
        # data.append(ChatroomSerializer(chatrooms[i]))
        data.append({'id':chatroom_user[i].chatroom.id,'name':chatroom_user[i].chatroom.chatroomName})
        print(chatroom_user[i].chatroom.chatroomAvatar)
        image = open( str(chatroom_user[i].chatroom.chatroomAvatar), 'r').read()
        data[i]['Base64'] = image
    return Response(data , status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([])
def ShowChatroomProfile(request):
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    if list(chatroom) != []:
        chatroom = chatroom[0]
        serializer = ShowUChatroomProfileSerializer(chatroom)
        data = serializer.data
        filename = 'media/chatroom/image/' + str(chatroom.id) + '.txt'
        data['chatroom_profile_image'] = open(filename, 'rb').read()
        data['chatroomLink'] = 'http://127.0.0.1:8000/ShowChatroomByLink/chatroom' + str(chatroom.id) + '/'
        data['topicLink'] = chatroom.Link
        if data['selectedTopic'] == "PL":
            data['selectedTopic'] = "Programing Language(" + chatroom.selected + ")" 
        elif data['selectedTopic'] == "App":
            data['selectedTopic'] = "Application(" + chatroom.selected + ")"
        elif data['selectedTopic'] == "OS":
            data['selectedTopic'] = "Operating System(" + chatroom.selected + ")"
        return Response(data)
        
    return Response({'message': 'Chatroom not found'})

@api_view(['POST', ])
@permission_classes([])
def EditChatroomProfile(request):
    chatroom = Chatroom.objects.filter(id=request.data['chatroomId'])
    print("////////////////////////////////////////////////hi" , request.data.keys())
    if list(chatroom) != []:
        chatroom = chatroom[0]
        serializer = ShowUChatroomProfileSerializer(chatroom)
        data = serializer.data

        if 'chatroomName' in request.data.keys():
            chatroom.chatroomName = request.data['chatroomName']

        if 'Description' in request.data.keys():
            chatroom.Description = request.data['Description']

        if 'topicLink' in request.data.keys() and chatroom.selectedTopic != 'OS':
            chatroom.Link = request.data['topicLink']
        print("////////////////////////////////////////////////bye" , request.data.keys())
        if 'chatroom_profile_image' in request.data.keys():
            filepath = 'media/chatroom/image/' + str(chatroom.id) + '.txt'
            print("//////////////////////////////////////////////////////////////////:::::" , filepath)
            file = open(filepath, 'w')
            file.write(request.POST['chatroom_profile_image'])
            file.close()
        chatroom.save()
        return Response({'message':'edit successfully'})
        
    return Response({'message': 'Chatroom not found'})


