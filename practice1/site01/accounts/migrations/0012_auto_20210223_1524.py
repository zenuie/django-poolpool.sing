# Generated by Django 3.1.2 on 2021-02-23 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_auto_20210107_1118'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='profile_pic',
            field=models.ImageField(blank=True, default='/images', null=True, upload_to=''),
        ),
    ]