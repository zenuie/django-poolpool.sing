from django.shortcuts import render


def test(request):
    return render(request, 'music_player/index.html')
# Create your views here.
