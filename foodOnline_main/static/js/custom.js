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

$(document).ready(function(){
    $('.add_to_cart').on('click', function(e){
        e.preventDefault();

        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        price = $(this).attr('data-price');


        data = {
            'food_id': food_id,            
        }


        $.ajax({
            type: 'GET',
            url: url,
            data: data,
            success: function(response){
                if (response.status == "login_required"){
                    console.log(response);
                    swal(response.message, "", "info").then(function(){
                        window.location = '/login'
                    });
                }else if (response.status == 'Failed'){
                        console.log(response);
                        swal(response.message, "", "error");
                }else{                                   
                    $('#qty-'+food_id).html(response.qty);
                    $('#cart_counter').html(response.cart_counter['cart_count']);
                    
                    // subtotal, tax, grand_total
                    applyCartAmounts(response.cart_amounts.subtotal, response.cart_amounts.tax, response.cart_amounts.grand_total)
                }
                
            }
        })
    })

    // place the cart items quantity on load
    $('.item_qty').each(function(){
        var the_id = $(this).attr('id')
        var qty = $(this).attr('data-qty')
        $('#'+the_id).html(qty)
        console.log('#'+the_id)
    })

    $('.decrease_cart').on('click', function(e){
        e.preventDefault();

        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        cart_id = $(this).attr('data-cart-id');
        price = $(this).attr('data-price');
      

        $.ajax({
            type:'GET',
            url: url,
            success: function(response){
                if (response.status == "login_required"){
                    console.log(response);
                    swal(response.message, "", "info").then(function(){
                        window.location = '/login'
                    });
                }else if (response.status == 'Failed'){
                        console.log(response);
                        swal(response.message, "", "error");
                }else{
                    console.log(response)
                    $('#qty-'+food_id).html(response.qty);
                    $('#cart_counter').html(response.cart_counter['cart_count']);
                    // subtotal, tax, grand_total
                    applyCartAmounts(
                        response.cart_amounts.subtotal, 
                        response.cart_amounts.tax, 
                        response.cart_amounts.grand_total
                    );

                    removeCartItem(response.qty, cart_id);
                    checkCartEmpty();
                    
                }
            }
        })
    })

    // DELETE CART

    $('.delete_cart').on('click', function(e){
        e.preventDefault();

        cart_id = $(this).attr('data-id');
        url = $(this).attr('data-url');

        $.ajax({
            type:'GET',
            url: url,
            success: function(response){
                if (response.status == 'Failed'){
                        console.log(response);
                        swal(response.message, "", "error");
                }else{
                    swal(response.status, response.message, "success");
                    $('#cart_counter').html(response.cart_counter['cart_count']);
                    if (window.location.pathname == '/cart/'){
                        removeCartItem(0, cart_id);
                        checkCartEmpty();
                    }       
                    applyCartAmounts(
                        response.cart_amounts.subtotal, 
                        response.cart_amounts.tax, 
                        response.cart_amounts.grand_total
                    );             
                }
            }
        })
    })
    
    // delete the cart element if the qty is 0
    function removeCartItem(cartItemQty, cart_id){
        
        if (cartItemQty <= 0){
            // remove the cart item element
            document.getElementById("cart-item-"+cart_id).remove()
        }
    }

    function checkCartEmpty(){
        var cart_counter = document.getElementById("cart_counter").innerHTML;
        if (cart_counter == 0){
           document.getElementById("empty-cart").style.display = "block"; 
        }
    }

    function applyCartAmounts(subtotal, tax, grand_total){
        if (window.location.pathname == '/cart/'){
            $('#subtotal').html(subtotal)
            $('#tax').html(tax)
            $('#grand_total').html(grand_total)
        }
    }
});