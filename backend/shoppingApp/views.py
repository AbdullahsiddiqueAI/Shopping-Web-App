from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, Order, OrderItem, Payment
from .serializer import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, PaymentSerializer
from core.models import UserCustomModel as User
from core.serializer import UserSerializer 
import json
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
        return Response({"success":True,"data":"Delete Category Successfully","status":204},status=status.HTTP_204_NO_CONTENT)

# Product API Views
class ProductListCreateAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response({"success":True,"data":serializer.data,"status":200})

    def post(self, request):
        category_data = request.data.get("category")
        if not category_data:
            return Response({"success": False, "error": "Category is required", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(category_id=category_data)
        except Category.DoesNotExist:
            return Response({"success": False, "error": "Invalid category ID", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure that the request data includes the category object
        data = request.data.copy()
        data["category"] = CategorySerializer(category).data

        serializer = ProductSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data, "status": 200}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "error": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)
class ProductDetailAPIView(APIView):
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
        return Response({"success":True,"data":"Delete Product Successfully","status":204},status=status.HTTP_204_NO_CONTENT)

# Order API Views
class OrderListCreateAPIView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.get(user=request.user)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# OrderItem API Views
class OrderItemListCreateAPIView(APIView):
    def get(self, request):
        order_items = OrderItem.objects.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderItemDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderItemSerializer(order_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        order_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Payment API Views
class PaymentListCreateAPIView(APIView):
    def get(self, request):
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PaymentSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
