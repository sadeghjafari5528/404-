from django.urls import path

from . import views

urlpatterns = [
    path('generalchatroom/', views.index, name='index'),
    path('generalchatroom/<str:room_name>/', views.room, name='room'),
    path('show_Message/', views.show_Message, name='show_Message'),
]
