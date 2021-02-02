from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.signin, name="signin"),
    path("signup/", views.signup, name="signup"),
]