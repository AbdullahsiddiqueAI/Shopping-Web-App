from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializer import *
from core.models import UserCustomModel as User
from core.serializer import UserSerializer 
import json
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from payments.models import Payment
from rest_framework.decorators import api_view

# Category API Views
class CategoryListCreateAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({"success":True,"data":serializer.data,"status":200})

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success":True,"data":serializer.data,"status":201}, status=status.HTTP_201_CREATED)
        return Response({"success":False,"data":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailAPIView(APIView):
    def get_permissions(self):
        # Check if the request method is POST
        if self.request.method == 'PATCH' or self.request.method == 'DELETE':
            # Apply the desired permission class for POST requests
            return [IsAdminUser()]
        # No permissions are required for GET requests
        return []
    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response({"success":True,"data":serializer.data,"status":200})

    def patch(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        print("Category",request.data.keys())
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success":True,"data":serializer.data,"status":200})
        return Response({"success":False,"error":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response({"success":True,"data":{
            "category_id":pk
            },"status":204},status=status.HTTP_200_OK)  


class CustomPagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'  
    max_page_size = 100  

# Product API Views
class ProductListCreateAPIView(APIView):
    pagination_class = CustomPagination
    def get_permissions(self):
        
        if self.request.method == 'POST':
            
            return [IsAuthenticated()]
        
        return []
    def get(self, request):
        
        
        sort_by = request.query_params.get('sort_by', None)
        search_query = request.query_params.get('search', None)
        category_id = request.query_params.get('category', None)
        if str(category_id) == 'all':
            category_id = None
        
    
        products = Product.objects.all()

       
        if category_id:
            products = products.filter(category__category_id=category_id)

        
        if search_query:
            products = products.filter(
                Q(name__icontains=search_query) | Q(description__icontains=search_query)
            )

        
        if sort_by == 'high-to-low':
            products = products.order_by('-price')  
        elif sort_by == 'low-to-high':
            products = products.order_by('price')  
        elif sort_by == 'newest':
            products = products.order_by('-created_at')  
        elif sort_by == 'oldest':
            products = products.order_by('created_at')  

        
        paginator = self.pagination_class()
        paginated_products = paginator.paginate_queryset(products, request)

        
        serializer = ProductSerializer(paginated_products, many=True)


        return paginator.get_paginated_response({
            "success": True,
            "data": serializer.data,
            "status": 200
        })

    def post(self, request):
        category_data = request.data.get("category")
        if not category_data:
            return Response({"success": False, "error": "Category is required", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(category_id=category_data)
        except Category.DoesNotExist:
            return Response({"success": False, "error": "Invalid category ID", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

   
        data = request.data.copy()
        data["category"] = CategorySerializer(category).data

        serializer = ProductSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data, "status": 200}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "error": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailAPIView(APIView):

    def get_permissions(self):
        
        if self.request.method == 'PATCH' or self.request.method == 'DELETE':
            
            return [IsAdminUser()]
        
        return []
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response({"success":True,"data":serializer.data,"status":200})

    def patch(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"success":False,"error":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({"success":True,"data":{
            "product_id":pk
            },"status":204},status=status.HTTP_200_OK)


class OrderListCreateAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        orders = Order.objects.filter(user_id=request.user.id).order_by('-order_date')
        serializer = OrderSerializer(orders, many=True)
        return Response({"success": True, "data": serializer.data, "status": 200})

    def post(self, request):
        serializer = OrderSerializer(data=request.data,context={'request': request})
        try:
            if serializer.is_valid(): 
                serializer.save()
                return Response({"success": True, "data": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
       
        except Exception as e:
            return Response({"success": False, "error": str(e), "status": 400}, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailAPIView(APIView):
    # permission_classes=[IsAuthenticated]
    def get_permissions(self):

        if self.request.method == 'PATCH' or self.request.method == 'DELETE':
           
            return [IsAdminUser()]
       
        return [IsAuthenticated()]
    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response({"success": True, "data": serializer.data, "status": 200})

    def patch(self, request, pk):
        order = Order.objects.filter(pk=pk).first()
        if not order:  
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data, "status": 200})
        return Response({"success": False, "error": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        
        
        order = Order.objects.filter(pk=pk).first()
        if not order: 
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        order.delete()
        return Response({"success":True,"data":"Order Deleted Successfully","status":204},status=status.HTTP_204_NO_CONTENT)


class OrderCancelAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        orders = Order.objects.filter(user_id=request.user.id,status='Canceled').order_by('-order_date')
        serializer = OrderSerializer(orders, many=True)
        return Response({"success": True, "data": serializer.data, "status": 200})
    def post(self, request, pk):
        order = Order.objects.filter(pk=pk,user_id=request.user.id).first()
        if not order:  
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        if order.status == "Canceled":
            return Response({"success":False,"error":"Order is already canceled","status":400},status=status.HTTP_400_BAD_REQUEST)
        order.status = "Canceled"
        order.save()
        return Response({"success":True,"data":"Order Canceled Successfully","status":200},status=status.HTTP_200_OK)



class AdminOrderGetAPIView(APIView):
    permission_classes=[IsAdminUser]
  
    def get(self, request):
        try:
            order = Order.objects.all().order_by('-order_date')
        except Order.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order,many=True)
        return Response({"success": True, "data": serializer.data, "status": 200})

        




class OrderItemListCreateAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        order_items = OrderItem.objects.filter(user_id=request.user.id,order__isnull=True)
        serializer = OrderItemSerializer(order_items, many=True)
        return Response({"success":True,"data":serializer.data,"status":200})

    def post(self, request):
        product_id = request.data.get('product')
        quantity = request.data.get('quantity')
        print("quantity: ",quantity)  

        
        order_item = OrderItem.objects.filter(user_id=request.user.id,product_id=product_id,order__isnull=True).first()

        if order_item:
           
            if quantity:
                order_item.quantity+=int(quantity)
            else:
                order_item.quantity += 1
                
                
            
            order_item.save()

      
            order_item_serializer = OrderItemSerializer(order_item)
            return Response({"success": True, "data": order_item_serializer.data, "status": 200}, status=status.HTTP_201_CREATED)

       
        serializer = OrderItemSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)

        
        return Response({"success":False,"error":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)

class OrderItemDetailAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk):
        try:
            order_item = OrderItem.objects.filter(pk=pk).first()
        except OrderItem.DoesNotExist:
            return Response({"success":False,"error":"Not Found","status":404},status=status.HTTP_404_NOT_FOUND)
        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data)

   
    def delete(self, request, pk):
        try:
            
            order_item = OrderItem.objects.get(product_id=pk, user_id=request.user.id, order_id__isnull=True)
        except OrderItem.DoesNotExist:
            return Response({"success": False, "error": "Not Found", "status": 404}, status=status.HTTP_404_NOT_FOUND)
        
        order_item.delete()
        return Response({"success": True, "data": "Order Item Deleted Successfully", "status": 204}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def submit_contact_form(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # Payment API Views
class PaymentListCreateAPIView(APIView):
    def get(self, request):
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response({"success": True, "data": serializer.data, "status": 200},status=status.HTTP_200_OK)

 
class PaymentDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PaymentSerializer(payment)
        return Response({"success": True, "data": serializer.data, "status": 200},status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PaymentSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data, "status": 200},status=status.HTTP_200_OK)
        return Response({"success":False,"error":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({"success":False,"error":serializer.errors,"status":400}, status=status.HTTP_400_BAD_REQUEST)
        payment.delete()
        return Response(status=status.HTTP_200_OK)
class FeaturedProduct(APIView):
    def get_permissions(self):
        if self.request.method =='POST':
            return [IsAuthenticated()]
        return []
    def get(self, request):
       featured_products = Product.objects.filter(is_featured=True)
       serializer = ProductSerializer(featured_products, many=True)
       return Response({"success":True, "data": serializer.data, "status": 200},status=status.HTTP_200_OK)   
