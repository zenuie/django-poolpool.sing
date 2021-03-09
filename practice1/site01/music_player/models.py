from django.db import models
from django.contrib.auth.models import User


class Song_list(models.Model):
    song_name = models.CharField(max_length=200, null=True)
    article = models.CharField(max_length=200, null=True)
    album = models.CharField(max_length=200, null=True)
    album_picture = models.ImageField(default="profile1.png", null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
