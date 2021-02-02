from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
import datetime
import nltk
from nltk.corpus import stopwords  
from nltk.tokenize import word_tokenize 

# import time 

from .serializer import QuestionSerializer , AnswerSerializer , ShowUserProfileSerializer
from .models import Answer , Question , User_Question , User_Answer
from chatroom.models import Chatroom
from registeration.models import User

@api_view(['POST' , ])
def ShowQuestion(request):
    chatroom = Chatroom.objects.filter(id=request.data['ChatroomID'])
    requestUser = User.objects.filter(id=request.data['user_id'])
    if list(chatroom) != []:
        questions = Question.objects.filter(chatroom=chatroom[0])
        data_list = []
        for i in questions:
            serializer = QuestionSerializer(i)
            data = serializer.data
            # print(usrequestUserer)
            # print(i)
            user_question = User_Question.objects.filter(user=requestUser[0] , question=i)
            print(user_question)
            if list(user_question) == []:
                data['sameProblem']=0
            else:
                data['sameProblem']=user_question[0].voteState
            data['time']=i.time.ctime()
            if data['file']!=None:
                data['file'] = 'http://127.0.0.1:8000' + data['file']
            if i.user == None:
                data['user'] = 'User is not exist'
                data['userid'] = 'no id'
            else:
                user = i.user
                data['user'] = user.username
                data['userid'] = user.id
            data_list.append(data)
        return Response(data_list)
    return Response({'message' : 'Chatroom not found'})

@api_view(['POST' , ])
def ShowAnswer(request):
    question = Question.objects.filter(id=request.data['QuestionID'])
    if list(question) != []:
        answers = Answer.objects.filter(question=question[0]).order_by('isAccepted' , 'vote')
        answers = answers[::-1]
        data_list = []
        for i in answers:
            serializer = AnswerSerializer(i)
            data = serializer.data
            user_answer = User_Answer.objects.filter(user=request.data['user_id'] , answer=i)
            if list(user_answer) != []:
                data["voteState"] = user_answer[0].voteState
            else:
                data["voteState"] = 0
            data['time']=i.time.ctime()

            if data['file']!=None:
                data['file'] = 'http://127.0.0.1:8000' + data['file']
            if i.user == None:
                data['user'] = 'User is not exist'
                data['userid'] = 'no id'
            else:
                user = i.user
                data['user'] = user.username
                data['userid'] = user.id
            data_list.append(data)
        return Response(data_list)
    return Response({'message' : 'Question not found'})

@api_view(['POST' , ])
def ShowUserProfile(request):
    user = User.objects.filter(id=request.data['user_id'])
    if list(user) != []:
        user = user[0]
        serializer = ShowUserProfileSerializer(user)
        data = serializer.data
        filename = 'media/profile/image/' + str(user.id) + '.txt'
        data['user_profile_image'] = open(filename, 'rb').read()
        print(data)
        return Response(data)
    return Response({'message' : 'User not found'})

def calculateSearchOrder(searchText , QuestionText):
    value = 0
    for word in searchText:
        if word in QuestionText:
            value += 1
    return value

def Sort(sub_li): 
    sub_li.sort(key = lambda x: x[1]) 
    return sub_li[::-1]

def DetectStopWords(text):
    stop_words = set(stopwords.words('english'))  
    
    word_tokens = word_tokenize(text)  
    
    filtered_sentence = [w for w in word_tokens if not w in stop_words]
    return filtered_sentence
  
def TimeFilter(index):
    time = datetime.datetime.now()
    if index == 1:
        time -= datetime.timedelta(days=730)
    elif index == 2:
        time -= datetime.timedelta(days=365)
    elif index == 3:
        time -= datetime.timedelta(days=180)
    elif index == 4:
        time -= datetime.timedelta(days=90)
    elif index == 5:
        time -= datetime.timedelta(days=30)
    elif index == 6:
        time -= datetime.timedelta(days=7)
    return time

@api_view(['POST' , ])
def GeneralSearch(request):
    # advance filter
    print(request.data)
    time_list = []
    query = Q()
    if 'timePeriod' in request.data.keys():
        if int(request.data['timePeriod'][0]) != 0:
            time_filter = TimeFilter(int(request.data['timePeriod'][0]))
            query = query & Q(time__gte=time_filter)

    if 'isAnswered' in request.data.keys():
        if request.data['isAnswered'][0] == '1':
            query = query & Q(isAnswered=True)

    if 'chatroomID' in request.data.keys():
        query = query & Q(chatroom=request.data['chatroomID'])

    no_member_dic = {0:10 , 1:100 , 2:1000 , 3:5000 , 4:10000 , 5:0}
    queryset = []
    if 'sort' in request.data.keys():
        if request.data['sort'] == '0':
            # newest
            queryset = Question.objects.filter(query).order_by('time')
        elif request.data['sort'] == '1':
            #oldest
            queryset = Question.objects.filter(query).order_by('time').reverse()
        elif request.data['sort'] == '2':
            # vote
            queryset = Question.objects.filter(query).order_by('vote')
    else:
        queryset = Question.objects.filter(query)
    valuelist = []
    searchText = request.data["searchText"]
    searchText = DetectStopWords(searchText)
    user = User.objects.filter(id=request.data['user_id']) 
    if list(user) == []:
        return Response({'message':'user not found'})
    for q in range(len(queryset)):
        numberOfUser = 0
        if queryset[q].chatroom != None:
            numberOfUser = queryset[q].chatroom.numberOfUser

        if 'chatroomMember' in request.data.keys():
            if int(request.data['chatroomMember']) > 5:
                return Response({'message':'index of chatroomMember is not valid'})
            if numberOfUser >= no_member_dic[int(request.data['chatroomMember'])]:
                value = calculateSearchOrder(searchText , queryset[q].text)
                if value > 0:
                    valuelist.append([q , calculateSearchOrder(searchText , queryset[q].text)])
    valuelist = Sort(valuelist)
    data_list = []
    for i in valuelist:
        if i[1] > 0:
            data = QuestionSerializer(queryset[i[0]]).data
            data['chatroom'] = queryset[i[0]].chatroom
            data['time']=queryset[i[0]].time.ctime()
            user_question = User_Question.objects.filter(user=user[0], question=queryset[i[0]])
            if list(user_question) == []:
                data['voteState'] = 0
            else:
                data['voteState'] = user_question[0].voteState
            if queryset[i[0]].user != None:
                data['user'] = queryset[i[0]].user.username
                data['userid'] = queryset[i[0]].user.id
            else:
                data['user'] = 'user does not exist'
                data['userid'] = 'user does not exist'
            data['time']=queryset[i[0]].time.ctime()
            data_list.append(data)
    chatroom_id_list = []
    chatroom_list = []
    for i in data_list:
        if not i['chatroom'] in chatroom_id_list:
            chatroom_id_list.append(i['chatroom'])
            if i["chatroom"] != None:
                chatroom_data = {}
                chatroom_data["ChatroomID"] = i['chatroom'].id
                chatroom_data["name"] = i['chatroom'].chatroomName
                chatroom_data["image"] = open( str(i["chatroom"].chatroomAvatar), 'r').read()
                chatroom_list.append(chatroom_data)
        if i["chatroom"] == None:
            i["chatroom"] = "not exist"
        else:
            i["chatroom"] = i["chatroom"].id
            
    return Response({"questions": data_list , "chatrooms": chatroom_list})

#document :
    # realtime sreach (only on chatrooms)
    # advanced filter :
        # chatroom
        # period of time
        # chatroom with more user
        # question with true answer

@api_view(['POST' , ])
def SeggestionChatroomSreach(request):
    searchText = request.data["searchText"]
    searchTextlist = DetectStopWords(searchText)
    print(searchText)
    chatroom_value_list = []
    number_of_chatroom = 0
    for chatroom in Chatroom.objects.all():
        x = min(len(searchText), len(chatroom.chatroomName))
        similarty_of_chatroom_name = nltk.edit_distance(searchText[:x], chatroom.chatroomName[:x])
        print(similarty_of_chatroom_name)
        if similarty_of_chatroom_name < 3:
            chatroom_value_list.append([chatroom , 0])
            number_of_chatroom += 1
        
            for question in Question.objects.filter(chatroom=chatroom):
                chatroom_value_list[-1][1] += calculateSearchOrder(searchTextlist , question.text)

    chatroom_value_list = Sort(chatroom_value_list)
    if number_of_chatroom > 10:
        chatroom_value_list = chatroom_value_list[:10]
    data_list = []
    for chatroom in chatroom_value_list:
        data = {}
        data['chatroom_id'] = chatroom[0].id
        data['chatroom_name'] = chatroom[0].chatroomName
        data_list.append(data)
    return Response(data_list)


@api_view(['POST'])
def AddQuestion(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=data['chatroom'][0])
    user = User.objects.filter(id=request.data['user_id'])
    if list(user) != []:
        question = Question.objects.create(
            user=user[0],
            chatroom=chatroom[0],
            text=data['text'][0],
            time=datetime.datetime.now(),
        )
        if 'file' in request.FILES.keys():
            question.file = request.FILES['file']
        question.save()
        user[0].askedQuestions += 1
        user[0].save()
        return Response({'message': 'New question created'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'User not found'})


@api_view(['POST'])
def AddAnswer(request):
    data = dict(request.POST)
    question = Question.objects.filter(id=data['question'][0])
    user = User.objects.filter(id=request.data['user_id'])
    if list(user) != []:
        answer = Answer.objects.create(
            user=user[0],
            question=question[0],
            text=data['text'][0],
            time=datetime.datetime.now(),
        )
        if 'file' in request.FILES.keys():
            answer.file = request.FILES['file']
        answer.save()
        user[0].answeredQuestions += 1
        user[0].save()
        return Response({'message': 'New answer created'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'User not found'})

@api_view(['POST'])
def EditQuestion(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=data['chatroom'][0])
    user = User.objects.filter(id=data['user_id'][0])
    question = Question.objects.filter(id=data['id'][0] , user=user[0] , chatroom=chatroom[0])
    if list(question) != []:
        if 'text' in data.keys():
            question[0].text = data['text'][0]
        if 'isAnswered' in data.keys():
            question[0].isAnswered = data['isAnswered']
        if 'file' in request.FILES.keys():
            question[0].isAnswered = request.FILES['file']
        question[0].save()
        return Response({'message':'edit complete'})
    else:
        return Response({'message':'you can`t edit'})

@api_view(['POST'])
def DeleteQuestion(request):
    data = dict(request.POST)
    chatroom = Chatroom.objects.filter(id=data['chatroom'][0])
    user = User.objects.filter(id=data['user_id'][0])
    question = Question.objects.filter(id=data['id'][0] , user=user[0] , chatroom=chatroom[0])
    if list(question) != []:
        question.delete()
        if list(user) != []:
            user[0].askedQuestions -= 1
            user[0].save()
        return Response({'message':'delete complete'})
    else:
        return Response({'message':'you can`t delete'})

@api_view(['POST'])
def VoteQuestion(request):
    data = dict(request.POST)
    question = Question.objects.filter(id=data['question_id'][0])
    user = User.objects.filter(id=data['user_id'][0])
    if (list(user) != []) and (list(question) != []):
        user_question = User_Question.objects.filter(user=user[0] , question=question[0])
    else:
        return Response({"message": 'user or question not exists'})
    if list(user_question) != []:
        if user_question[0].voteState == int(data['voteState'][0]):
            return Response({'message':'this user can not do that'})
        else:
            
            if list(question) != []:
                question[0].vote += int(data['voteState'][0]) - user_question[0].voteState
                question[0].save()
                user_question[0].voteState = int(data['voteState'][0])
                user_question[0].save()
    else:
        user_question = User_Question.objects.create(user=user[0] , question=question[0] , voteState=int(data['voteState'][0]))
        if list(question) != []:
            question[0].vote += int(data['voteState'][0])
            question[0].save()
    return Response({'message':'done it'})

@api_view(['POST'])
def ShowvoteQuestion(request):
    data = dict(request.POST)
    question = Question.objects.filter(id=data['question_id'][0])
    user = User.objects.filter(id=data['user_id'][0])
    user_question = User_Question.objects.filter(user=user[0] , question=question[0])
    if list(user_question) != []:
        return Response({'message': False})
    else:
        return Response({'message': True})

@api_view(['POST'])
def EditAnswer(request):
    data = dict(request.POST)
    question = Question.objects.filter(id=data['question'][0])
    user = User.objects.filter(id=data['user_id'][0])
    answer = Answer.objects.filter(id=data['id'][0] , user=user[0] , question=question[0])
    if list(answer) != []:
        if 'text' in data.keys():
            answer[0].text = data['text'][0]
        if 'isAccepted' in data.keys():
            if request.data['isAccepted'] == 'true':
                data['isAccepted'] = True
            else: 
                data['isAccepted'] = False
            answer[0].isAccepted = data['isAccepted']
        if 'file' in request.FILES.keys():
            answer[0].isAnswered = request.FILES['file']
        answer[0].save()
        return Response({'message':'edit complete'})
    else:
        return Response({'message':'you can`t edit'})
@api_view(['POST'])
def DeleteAnswer(request):
    data = dict(request.POST)
    question = Question.objects.filter(id=data['question'][0])
    user = User.objects.filter(id=data['user_id'][0])
    answer = Answer.objects.filter(id=request.data['id'] , user=user[0] , question=question[0])
    if list(answer) != []:
        answer.delete()
        print("salas", user[0].answeredQuestions)
        if list(user) != []:
            user[0].answeredQuestions -= 1
            user[0].save()
        print("salas", user[0].answeredQuestions)
        return Response({'message':'delete complete'})
    else:
        return Response({'message':'you can`t delete'})
@api_view(['POST'])
def VoteAnswer(request):
    data = dict(request.POST)
    answer = Answer.objects.filter(id=data['answer_id'][0])
    user = User.objects.filter(id=data['user_id'][0])
    user_answer = User_Answer.objects.filter(user=user[0] , answer=answer[0])
    if list(user_answer) != []:
        if user_answer[0].voteState == int(data['voteState'][0]):
            return Response({'message':'this user can not do that'})
        else:
            
            if list(answer) != []:
                answer[0].vote += int(data['voteState'][0]) - user_answer[0].voteState
                answer[0].save()
                user_answer[0].voteState = int(data['voteState'][0])
                user_answer[0].save()
    else:
        user_answer = User_Answer.objects.create(user=user[0] , answer=answer[0] , voteState=int(data['voteState'][0]))
        if list(answer) != []:
            answer[0].vote += int(data['voteState'][0])
            answer[0].save()
    return Response({'message':'done it'})
@api_view(['POST'])
def ShowVoteAnswer(request):
    data = dict(request.POST)
    answer = Answer.objects.filter(id=data['answer_id'][0])
    user = User.objects.filter(id=request.data['user_id'][0])
    user_answer = User_Answer.objects.filter(user=user[0] , answer=answer[0])
    if list(user_answer) != []:
        return Response({'message': user_answer.voteState})
    else:
        return Response({'message':0})
