import profile
from xml.sax.xmlreader import AttributesImpl
from django import forms
from django import forms
from django.forms import CharField, ValidationError
from .models import User, UserManager, UserProfile
from .validators import allow_only_images_validator

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    confirm_password = forms.CharField(widget=forms.PasswordInput())
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email']

    def clean(self):
        cleaned_data = super(UserForm, self).clean()
        password = cleaned_data['password']
        confirm_password = cleaned_data['confirm_password']

        if password != confirm_password:
            raise forms.ValidationError(
                "Password không giống nhau"
            )

class UserProfileForm(forms.ModelForm):
    address = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Start typing ...', 'required': ' required'}))
    profile_picture = forms.FileField(widget=forms.FileInput(attrs={'class': 'btn btn-info'}), validators=[allow_only_images_validator])
    cover_photo = forms.FileField(widget=forms.FileInput(attrs={'class': 'btn btn-info'}), validators=[allow_only_images_validator])
    
    # latitude = forms.CharField(widget=forms.TextInput(attrs={'readonly': 'readonly'}))
    # longtitude = forms.CharField(widget=forms.TextInput(attrs={'readonly': 'readonly'}))
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'cover_photo', 'address', 'country', 'state', 'city', 'pin_code', 'latitude', 'longtitude']

    def __init__(self, *args, **kwargs):
        super(UserProfileForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            if field == 'latitude' or field == 'longtitude':
                self.fields[field].widget.attrs['readonly'] = 'readonly'    

