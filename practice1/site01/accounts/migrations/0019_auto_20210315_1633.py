# Generated by Django 3.1.2 on 2021-03-15 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0018_auto_20210309_1504'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='registered_number',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='profile_pic',
            field=models.ImageField(blank=True, default='image/profile1.png', null=True, upload_to=''),
        ),
    ]