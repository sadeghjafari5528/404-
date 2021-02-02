from rest_framework.serializers import ModelSerializer

from registeration.models import User


class JoinSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')


