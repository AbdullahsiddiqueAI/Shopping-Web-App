# from faker import Faker
# from core.models import UserCustomModel as User
# from shoppingApp.models import *
# import random
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status

# class SeedDataAPIView(APIView):
#     def get(self, request):
#         try:
#             fake = Faker()

#             # Create Users
#             for _ in range(10):
#                 User.objects.create(
#                     username=fake.user_name(),
#                     email=fake.email(),
#                     password=fake.password()  # Ensure you use a hashed password in production
#                 )
    
#             # Create Categories
#             for _ in range(5):
#                 Category.objects.create(
#                     name=fake.word(),
#                     description=fake.text()
#                 )
    
#             # Create Products
#             categories = Category.objects.all()
#             for _ in range(20):
#                 Product.objects.create(
#                     name=fake.word(),
#                     description=fake.text(),
#                     price=fake.random_number(digits=4),
#                     stock=fake.random_number(digits=2),
#                     category=random.choice(categories)
#                 )
    
#             # Create Orders
#             users = User.objects.all()
#             for _ in range(15):
#                 Order.objects.create(
#                     user=random.choice(users),
#                     total_amount=fake.random_number(digits=4),
#                     status=random.choice(['Placed', 'Processing', 'Shipped', 'Delivered'])
#                 )
    
#             # Create OrderItems
#             orders = Order.objects.all()
#             products = Product.objects.all()
#             for _ in range(50):
#                 OrderItem.objects.create(
#                     order=random.choice(orders),
#                     product=random.choice(products),
#                     quantity=fake.random_number(digits=2),
#                     price=fake.random_number(digits=4),
#                     total=fake.random_number(digits=4)
#                 )
    
#             # Create Payments
#             for _ in range(15):
#                 Payment.objects.create(
#                     order=random.choice(orders),
#                     amount=fake.random_number(digits=4),
#                     status=random.choice(['Pending', 'Completed', 'Failed'])
#                 )
#             return Response({'status': 'Data seeded successfully'}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)