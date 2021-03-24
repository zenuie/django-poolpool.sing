from django.forms import ModelForm
from .models import Customer
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from music_player.models import Song


class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'
        exclude = ['user']


class OrderForm(ModelForm):
    class Meta:
        model = Song
        fields = '__all__'


class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
