# Generated by Django 3.1.2 on 2021-02-26 01:22

from django.db import migrations, models



class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_auto_20210224_1648'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='profile_pic',
            field=models.ImageField(upload_to='profile1.png'),
        ),
    ]
