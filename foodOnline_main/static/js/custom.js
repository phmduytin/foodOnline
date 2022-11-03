let autocomplete;

function initAutoComplete(){
autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('id_address'),
    {
        types: ['geocode', 'establishment'],
        //default in this app is "VN" - add your country code
        componentRestrictions: {'country': ['vn']},
    })
// function to specify what should happen when the prediction is clicked
autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged (){
    var place = autocomplete.getPlace();

    // User did not select the prediction. Reset the input field or alert()
    if (!place.geometry){
        document.getElementById('id_address').placeholder = "Start typing...";
    }
    else{
        //console.log('place name=>', place.name)
    }
    // get the address components and assign them to the fields
    console.log(place);
    var geocoder = new google.maps.Geocoder()
    var address = document.getElementById('id_address').value

    geocoder.geocode({'address': address}, function(results, status){
        //console.log('status=>', results)
        if (status == google.maps.GeocoderStatus.OK){
            var latitude = results[0].geometry.location.lat();
            var longtitude = results[0].geometry.location.lng();
            // console.log('lng=>', longtitude);
            // document.getElementById('id_latitude').value = latitude
            // document.getElementById('id_longtitude').value = longtitude

            $('#id_latitude').val(latitude);
            $('#id_longtitude').val(longtitude);

        }
    })
    
    var len = place.address_components.length;
    var country = place.address_components[len-1].long_name;
    $('#id_country').val(country);

    if (len >= 2) {
        var state = place.address_components[len-2].long_name;
        $('#id_state').val(state);
    }  
    
    if (len >= 3){
        var city = place.address_components[len-3].long_name;
        $('#id_city').val(city);
    } 
    
}
