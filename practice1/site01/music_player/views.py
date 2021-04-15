from django.shortcuts import render
from .models import *


def test(request):
    songs = Song.objects.all()
    context = {'songs': songs}
    return render(request, 'music_player/index.html', context)
# Create your views here.
