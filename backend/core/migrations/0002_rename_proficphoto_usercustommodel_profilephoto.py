# Generated by Django 5.0.6 on 2024-09-05 09:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usercustommodel',
            old_name='proficPhoto',
            new_name='profilePhoto',
        ),
    ]