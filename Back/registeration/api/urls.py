from django.urls import path
from registeration.api.views import signup

app_name = "registeration"

urlpatterns = [
    path('signup' , signup , name="signup"),
]
