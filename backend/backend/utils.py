from core.models import *
from shoppingApp.models import *
from channels.db import database_sync_to_async


@database_sync_to_async
def fetch_total_sales():
    return Order.total_sales()

@database_sync_to_async
def fetch_total_orders():
    return Order.total_orders()

@database_sync_to_async
def fetch_new_users():
    return User.new_users()

@database_sync_to_async
def fetch_total_products():
    return Product.total_products()
@database_sync_to_async
def fetch_recent_orders():
    recent_orders = Order.objects.order_by('-order_date')[:5]
    return [
        {
            'order_id': str(order.order_id),
            'order_date': order.order_date.isoformat(),
            'total_amount': float(order.total_amount) if order.total_amount is not None else 0.0,
            'status': order.status,
            'user_id': str(order.user.id),
        }
        for order in recent_orders
    ]

async def get_dashboard_stats():
    total_sales = await fetch_total_sales()
    total_orders = await fetch_total_orders()
    new_users = await fetch_new_users()  
    total_products = await fetch_total_products()
    recent_orders = await fetch_recent_orders()

    return {
        'total_sales': total_sales,
        'total_orders': total_orders,
        'new_users': new_users,  
        'total_products': total_products,
        'recent_orders': recent_orders,
    }
