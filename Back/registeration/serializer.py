from rest_framework.serializers import ModelSerializer

from .models import User


class AccountRegistrationSerializer(ModelSerializer):
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.username = 'user-' + str(user.id)
        user.save()
        return user

    class Meta:
        model = User
        fields = ('email', 'password')


class UserSigninSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')