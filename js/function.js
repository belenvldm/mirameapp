$(document).ready(function(){

    // AUTENTICACION DEL FORMULARIO DE LOGIN
    $('#formulario').submit(function() {
        // recolecta los valores que inserto el usuario
        var datosUsuario = $("#nombredeusuario").val()
        var datosPassword = $("#clave").val()
        
        archivoValidacion = "http://appmiramevidrieras.esy.es/host/validacion_de_datos.php?jsoncallback=?"

        $.getJSON( archivoValidacion, { usuario:datosUsuario ,password:datosPassword})
        .done(function(respuestaServer) {
            
            $mensa = respuestaServer.mensaje;

            for (i= 0; i < $mensa.length; i++) { 

                $.each($mensa[i], function(i, campo) {

                    if (i == "id") {
                        localStorage.setItem("id_user", campo);
                    }
                });
            }

            if(respuestaServer.validacion == "ok"){
                $.mobile.changePage("#recordatorios");
            }else{
                $('#datos_inc').append(respuestaServer.mensaje)
            }
        })
        return false;
    });

    $aide = localStorage.getItem("id_user");

    // TRAE LOS RECORDATORIOS    
    archivoRecordatorios = "http://appmiramevidrieras.esy.es/host/recordatorios.php"

    $.getJSON(archivoRecordatorios, {id:$aide})
    .done(function(resultados){ //resultados, es un array con todos los objetos.
        
        for (i= 0; i < resultados.length; i++) { // recorre el array resultados

            $.each(resultados[i], function(i, campo){ // each, bucle en cada vuelta toma el indice (propiedad) y el campo (valor). Es para recorrer un solo objeto. La "i" de este () no es la misma que del for.
                if (i == "title_record") {
                   $("#lista").append("<div class='ui-bar ui-bar-a'>" + campo + "</div>");
                } else {
                    $("#lista").append("<p id='body_red' class='ui-body ui-body-a ui-corner-all'>" + campo + "</p>"); // agrego en un div el campo. Aca se puede poner que agregue codigo html.
                }
            });
        }
    });

    // TRAE LAS ETAPAS
    $campoAnt = "Inicio";
    $vuelta = false;
    $string = "";

    archivoEtapas = "http://appmiramevidrieras.esy.es/host/etapas.php";

    $.getJSON(archivoEtapas, {id:$aide})
    .done(function(resultados){ //resultados, es un array con todos los objetos.
        for (i= 0; i < resultados.length; i++) { // recorre el array resultados

            $.each(resultados[i], function(i, campo){ // each, bucle en cada vuelta toma el indice (propiedad) y el campo (valor). Es para recorrer un solo objeto. La "i" de este () no es la misma que del for.
                if (i == "title_etapa") {
                    if (campo != $campoAnt) {

                        if (!$vuelta) {
                            $string += "<div id='collaps_etapas' data-role='collapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'> \n <h4 id='title_etapa'>" + campo + "</h4> \n <ul id='ul_etapa' data-role='listview' data-inset='false'>";

                            $vuelta = true;
                        } else {
                            $string += "</div> \n <div id='collaps_etapas' data-role='collapsible' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'> \n <h4 id='title_etapa'>" + campo + "</h4> \n <ul id='ul_etapa' data-role='listview' data-inset='false'>";
                        }
                    }
                    $campoAnt = campo;
                } else {
                    $string += "<li>" + campo + "</li> \n"; // agrego en un div el campo. Aca se puede poner que agregue codigo html.
                }
            });
        }

        $("#aca").append($string);
    });

    // FORMULARIO DE CONSULTAS
    $('#soporte').submit(function() {

        var asunto = $("#asunto").val();
        var pregunta = $("#pregunta").val();
        
        archivoValidacion = "http://appmiramevidrieras.esy.es/host/soporte.php?jsoncallback=?"

        $.getJSON( archivoValidacion, { asunto:asunto ,pregunta:pregunta})
        .done(function(respuestaServer) {
            
            if(respuestaServer.validacion == "ok"){
                $print = respuestaServer.consul;
                $("#cons").append("<li>" + $print + "</li> <br>");
                $("#cons").listview('refresh');
            }
        })

        $("#asunto").val("");
        $("#pregunta").val("");
        
        return false;
    });


    traeConsultas(0);

    function traeConsultas($valMas) {

        var valor = $valMas;

        archivoConsultas = "http://appmiramevidrieras.esy.es/host/consultas.php";

        $.getJSON(archivoConsultas, {mas:valor, id:$aide})
        .done(function(resultados) {
            
            for (i= 0; i < resultados.length; i++) {

                $.each(resultados[i], function(propiedad, campo){
                
                    if (campo != "") {
                        if (propiedad == "R") {
                            $("#cons").append("<li id='"+ i +"'><textarea rows='20' cols='7' id='body_res' class='ui-body ui-body-a body_res' readonly>" + campo + "</textarea></li>");
                        } else {
                            $("#cons").append("<li><textarea rows='20' cols='7' id='body_preg' class='ui-body ui-body-a body_preg' readonly>" + campo + "</textarea></li>");
                        }
                    } else {
                        $("#cons").append("<br>");
                    }
                });
            }

            $("#cons").append("<li id='anteriores'>Consultas anteriores</li>").on("click", function (){

                traeConsultas(1);
            });

            if (valor == 1) {
                $("#anteriores").remove();
            }
        });
    }

    // CREAR USUARIO
    $('#formcrear').submit(function() {
        // recolecta los valores que inserto el usuario
        var crearUsuario = $("#namecrear").val();
        var crearMail = $("#mailcrear").val();
        var crearPassword = $("#clavecrear").val();
        var crearEmpresa = $('#empresacrear').val();
        
        archivoValidacion = "http://appmiramevidrieras.esy.es/host/crearusuarios.php?jsoncallback=?"

        $.getJSON( archivoValidacion, { user:crearUsuario, mail:crearMail, pass:crearPassword, comp:crearEmpresa})
        .done(function(respuestaServer) {
            
            //alert(respuestaServer.mensaje);

            if(respuestaServer.validacion == "ok"){
                $.mobile.changePage("#loguin");
            }else{
                alert(respuestaServer.mensaje);
            }
        })
        return false;
    });    
});