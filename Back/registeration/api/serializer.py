from rest_framework import serializers

from registeration.models import User

class RegisterationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email' , 'password']
        extra_kwargs = {
            'password' : {'write_only' : True}
        }

    def save(self):
        user = User(
            email=self.validated_data['email']
        )
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user