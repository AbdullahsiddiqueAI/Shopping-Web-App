# Generated by Django 5.0.6 on 2024-09-03 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_usercustommodel_address_usercustommodel_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usercustommodel',
            name='accountType',
        ),
    ]
