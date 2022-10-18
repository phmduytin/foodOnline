import django
from django.http import HttpResponse
from django.shortcuts import redirect, render

from accounts.forms import UserForm
from vendor.forms import VendorForm
from .forms import UserForm
from .models import User, UserProfile
from vendor.models import Vendor
from django.contrib import messages

# Create your views here.

def registerUser(request):
    if request.method=='POST':
        form = UserForm(request.POST)
        if form.is_valid(): 
            #Create user using the form
            # password = form.cleaned_data['password']
            # user = form.save(commit=False)
            # user.set_password(password)
            # user.role = User.CUSTOMER
            # user.save()
            # print('Luu POST')
            # print(user)

            # Create the user using create_user method
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirm_password = form.cleaned_data['confirm_password']
            user = User.objects.create_user(first_name=first_name, last_name=last_name, username=username, email=email, password=password)
            user.role = User.CUSTOMER
            user.save()
            messages.success(request, "Your account has been registered successfully!")
            return redirect('registerUser')
        else:
            print('invalid')
            print(form.errors)
    else:
        form = UserForm()
    context = {
        'form' : form,
    }
    return render(request, 'accounts/registerUser.html', context)

def registerVendor(request):
    if request.method == 'POST':
        # store the data and create user
        form = UserForm(request.POST)
        v_form = VendorForm(request.POST, request.FILES)
        if form.is_valid() and v_form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirm_password = form.cleaned_data['confirm_password']
            
            user = User.objects.create_user(first_name=first_name, last_name=last_name, username=username, email=email, password=password)
            user.role = User.VENDOR
            user.save()

            #vendor_name = v_form.cleaned_data['vendor_name']
            #vendor_license = v_form.cleaned_data['vendor_license']
            vendor = v_form.save(commit=False)
            vendor.user = user
            vendor.user_profile = UserProfile.objects.get(user=user)
            vendor.save()

            messages.success(request, "Your restaurant has been registered successfully! Please wait for the approval!")
            return redirect('registerVendor')
        else:
            print('invalid form')
            print(form.errors)
            print(v_form.errors)
    else:
        form = UserForm()
        v_form = VendorForm()

    context = {
        'form': form,
        'v_form':v_form,
    }

    return render(request, 'accounts/registerVendor.html', context)