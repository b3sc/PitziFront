$(document).ready(function(){
    // Serialize Form
    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
        jQuery.map(unindexed_array, function(n, i) {
            indexed_array[n['name']] = n['value'];
        });
        return indexed_array;
    }
    // Montando show de assinaturas
    function ShowData(data) {
        $(".panel-group").css('display', "none");
        $(".result").html( '' );
        $(".result-orders").html( '' );
        $(".result").append('<p>Usuário: <strong>'+ data.name+''+
            '</strong></p><p>Email: <strong>'+ data.email+'</strong> </p>'+
            '</strong></p><p>CPF: <strong>'+ data.cpf +'</strong> </p>');
        if (data.orders.length > 0 ) {
            for (var i = 0; i < data.orders.length; i++) {
                $(".result-orders").append('<hr><p>Modelo do Telefone: <strong>'+ data.orders[i].phone_model +'</strong></p>'+
                    '<p>IMEI: <strong>'+ data.orders[i].imei +'</strong></p>'+
                    '<p>Preço Anual: <strong>'+ data.orders[i].anual_price +'</strong></p>'+
                    '<p>Número de Parcelas: <strong>'+ data.orders[i].number_plots +'</strong></p>');
            }
        }
    };
    // Montando alerta de erros
    function ShowErrors(data) {
        $(".append-errors").html( '' );
        $.each(data, function( index, value ) {
            $(".append-errors").append('<li>'+  index + ": " + value +'</li>');
        });        
    };
    // Função que envia uma requisição para criar um novo usuário e suas assinaturas relacionadas
    function sendRequestToCreateNewUser(params) {
        jQuery.ajax({
            type: 'POST',
            data: params,
            dataType: 'json',
            url: 'http://localhost:3000/api/v1/users',
            success: function(data) {
                $(".show-data").css('display', "block"); 
                $(".form-main").css('display', "none"); 
                ShowData(data);
            },
            error: function(xhr, errmsg, err) {
                $('html, body').animate({scrollTop:0}, 'slow');
                $(".panel-group").css('display', "block"); 
                ShowErrors(xhr.responseJSON);
                console.log(xhr.status + ': ' + xhr.responseText);

            },
        });
    };
    //Quando o usuário aperta o botão criar
    jQuery('#js-user-submit').click(function(e) {
        e.preventDefault();
        var params = getFormData(jQuery('#users_form'));
        sendRequestToCreateNewUser(params);     
    });
    //Nested Fields Orders
    var count = 1;
    jQuery('#js-nested').click(function(e) {
        count++;
        $(".nestedfields").append('<div class="form-orders">'+
            '<h4>Assinatura</h4>'+
            '<div class="form-group">'+
                '<label for="OrderPhoneModel">Modelo do Telefone</label>'+
                '<input type="text" name="user[orders_attributes]['+ count +'][phone_model]" id="field_phone_model" class="form-control">'+
            '</div>'+

            '<div class="form-group">'+
                '<label for="OrderImei">IMEI</label>'+
                '<input type="text" name="user[orders_attributes]['+ count +'][imei]" id="field_email" class="form-control">'+
            '</div>'+

            '<div class="form-group">'+
                '<label for="OrderAnualPrice">Preço Anual</label>'+
                '<input type="number" name="user[orders_attributes]['+ count +'][anual_price]" id="field_anual_price" class="form-control">'+
            '</div>'+

            '<div class="form-group">'+
                '<label for="OrderNumberPlots">Número de Parcelas</label>'+
                '<input type="number" name="user[orders_attributes]['+ count +'][number_plots]" id="field_number_plots" class="form-control">'+
            '</div>'+
        '</div>'); 
    });
    // Voltar a cadastrar
    jQuery('.back_signature').click(function(e) {
        e.preventDefault();
        $(".panel-group").css('display', "none");
        $('#users_form')[0].reset();
        $(".show-data").css('display', "none"); 
        $(".form-main").css('display', "block"); 
    });
});
