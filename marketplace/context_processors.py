from .models import Cart
from menu.models import FoodItem

def get_cart_counter(request):
    cart_count = 0
    subtotal = 0
    if request.user.is_authenticated:
        try:
            cart_items = Cart.objects.filter(user=request.user)
            if cart_items:
                for cart_item in cart_items:
                    cart_count += cart_item.quantity                    
        except:
            cart_count = 0
    return dict(cart_count=cart_count)

def get_cart_amounts(request):
    subtotal = 0
    tax = 0
    grand_total = 0
    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user)
        if cart_items:
            for cart_item in cart_items:
                # fooditem = FoodItem.objects.get(pk=cart_item.fooditem.id)
                subtotal += (cart_item.fooditem.price * cart_item.quantity)
                    
            grand_total += tax + subtotal
    return dict(subtotal=subtotal, tax=tax, grand_total=grand_total)
