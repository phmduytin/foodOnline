from django.contrib import admin
from vendor.models import Vendor

class CustomVendorAdmin(admin.ModelAdmin):
    list_display = ('user', 'vendor_name', 'is_approved', 'created_at')
    list_display_links = ['user', 'vendor_name']
    #ordering = ('-created_at',)
    # filter_horizontal = ()
    # list_filter = ()
    # fieldsets = ()

# Register your models here.
admin.site.register(Vendor, CustomVendorAdmin)
