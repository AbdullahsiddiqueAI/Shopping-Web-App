# shoppingApp/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Order, Product
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from core.models import UserCustomModel
from payments.models import Payment

# @receiver(post_save, sender=Order)
@receiver(post_delete, sender=Order)
@receiver(post_save, sender=Product)
@receiver(post_delete, sender=Product)
@receiver(post_save, sender=UserCustomModel)
@receiver(post_delete, sender=UserCustomModel)
@receiver(post_save, sender=Payment)
@receiver(post_delete, sender=Payment) 


def update_statistic(sender,instance,**kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "dashboard_group",
        {
            "type": "update_stats",
            "data": {}  
        }
    )
