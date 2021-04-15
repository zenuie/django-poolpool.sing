from django.contrib.auth.models import User
from music_player.models import Song
from django.db import models


# Create your models here.
class Customer(models.Model):  # 個人用戶資訊
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True)
    # phone = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200, null=True)
    profile_pic = models.ImageField(default="image/profile1.png", null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    # registered_number = models.IntegerField(null=True)


class Order(models.Model):  # 用戶點播紀錄
    STATUS = (
        ('點播次數', '點播次數'),
        ('尚未聽過', '尚未聽過'),
        ('已聽過', '已聽過'),
    )

    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    song = models.ForeignKey(Song, null=True, on_delete=models.SET_NULL)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    status = models.CharField(max_length=200, null=True, choices=STATUS)
    note = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return self.song.name
