from rest_framework import serializers
from registeration.models import User

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id' , 'first_name', 'last_name', 'username' , 'email']

class InterestsInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['description', 'interests']

