# Generated by Django 3.1.2 on 2021-03-25 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music_player', '0003_auto_20210324_1551'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='note',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
