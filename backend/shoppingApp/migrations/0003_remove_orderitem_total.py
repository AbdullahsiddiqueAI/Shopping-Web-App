# Generated by Django 5.0.6 on 2024-09-03 21:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shoppingApp', '0002_product_productpic_alter_product_category_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='total',
        ),
    ]
