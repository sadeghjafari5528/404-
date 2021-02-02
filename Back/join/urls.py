from django.urls import path

from . import views

urlpatterns = [
    path("Join/", views.Join, name="Join"),
    path("show_Users/", views.show_Users, name="show_Users"),
    path("Left/", views.Left, name="Left"),
    path("checkJoin/", views.checkJoin, name="checkJoin"),

]
