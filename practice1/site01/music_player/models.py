from django.db import models

from django.contrib.auth.models import User


class Artist(models.Model):
    name = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200, null=True)
    birthday = models.CharField(max_length=200, null=True,blank=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.name


class Album(models.Model):  # 歌曲專輯
    CATEGORY = (
        ('計畫內歌曲', '計畫內歌曲'),
        ('可投入計畫內歌曲', '可投入計畫內歌曲'),
    )

    artists = models.ForeignKey(Artist, null=True, on_delete=models.SET_NULL)
    genre = models.CharField(max_length=200, null=True)
    album_title = models.CharField(max_length=200, null=True)
    album_logo = models.ImageField(default="", null=True, blank=True)
    expected_song = models.CharField(max_length=200, null=True, choices=CATEGORY)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    # tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.album_title


class Song(models.Model):  # 歌曲資訊
    artists = models.ForeignKey(Artist, null=True, on_delete=models.SET_NULL)
    album = models.ForeignKey(Album, null=True, on_delete=models.SET_NULL)
    song_name = models.CharField(max_length=200, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    note = models.CharField(max_length=1000, null=True,blank=True)

    def __str__(self):
        return self.song_name
