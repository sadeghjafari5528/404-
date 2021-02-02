from django.urls import path
from . import views

urlpatterns = [
    path("showpersonalinfo/", views.show_personal_info, name="showpersonalinfo"),
    path("getpersonalinfo/", views.get_personal_info, name="getpersonalinfo"),
    path("editprofilepicture/", views.edit_profile_picture, name="editprofilepicture"),
    path("editinterest/", views.edit_interests, name="editinterest"),
    path("show_profile_picture/", views.show_profile_picture, name="show_profile_picture"),
    path("show_interests/", views.show_interests, name="show_interests"),
]