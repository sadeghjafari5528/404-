from django.urls import path
from . import views

urlpatterns = [
    path("AddQuestion/", views.AddQuestion, name="AddQuestion"),
    path("AddAnswer/", views.AddAnswer, name="AddAnswer"),
    path("ShowQuestion/", views.ShowQuestion, name="ShowQuestion"),
    path("ShowAnswer/", views.ShowAnswer, name="ShowAnswer"),
    path("ShowUserProfile/", views.ShowUserProfile, name="ShowUserProfile"),
    path("GeneralSearch/", views.GeneralSearch, name="GeneralSearch"),
    path("SeggestionChatroomSreach/", views.SeggestionChatroomSreach, name="SeggestionChatroomSreach"),
    path("EditQuestion/", views.EditQuestion, name="EditQuestion"),
    path("VoteQuestion/", views.VoteQuestion, name="VoteQuestion"),
    path("EditAnswer/", views.EditAnswer, name="EditAnswer"),
    path("VoteAnswer/", views.VoteAnswer, name="VoteAnswer"),
    path("ShowvoteQuestion/", views.ShowvoteQuestion, name="ShowvoteQuestion"),
    path("ShowVoteAnswer/", views.ShowVoteAnswer, name="ShowVoteAnswer"),
    path("DeleteQuestion/", views.DeleteQuestion, name="DeleteQuestion"),
    path("DeleteAnswer/", views.DeleteAnswer, name="DeleteAnswer"),
]
 