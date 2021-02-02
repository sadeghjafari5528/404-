from django.contrib import admin
from .models import Answer , Question , User_Answer , User_Question
admin.site.register(Question)
admin.site.register(Answer)

admin.site.register(User_Answer)
admin.site.register(User_Question)


