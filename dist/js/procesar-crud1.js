

/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";
function cargarSeccionRegistrarSala() {


    $(".seccioninfo").hide();
    $("#registrar-salas").show();

    cargarSelectEdificio();

}

function cargarSelectEdificio() {

    $("#idsalabloque").empty();
    $("#actidsalabloque").empty();

    $.ajax({
        url: `${url}/edificio/listar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {

            if (res.success) {
                for (let a of res.success) {
                    $("#idsalabloque").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                    $("#actidsalabloque").append('<option value=' + a.id + '>' + a.nombre + '</option>');

                }

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }
        },
        error: function (err) {

            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });
}

function registrarSala() {

    let edificio = $("#idsalabloque").val();
    let salon = $("#idsalasalon").val();
    let fila = $("#idsalafila").val();
    let columna = $("#idsalacolumna").val();

    $.ajax({
        url: `${url}/salas/registrar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            nombre: salon,
            torre: edificio,
            fila: fila,
            columna: columna
        },
        success: function (res) {
            if (res.success) {

                swal("Salon registrado", "Haga click en el boton para regresar", "success");
                $("#formagregarsala")[0].reset();

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });

}

function cargarSeccionConsultarSala() {
    $(".seccioninfo").hide();
    $("#consultar-salas").show();

    $('#table2').DataTable().destroy();
    $("#bodytablaconsultarsala").empty();

    cargarTablaSala();
    cargarSelectEdificio();

}

function cargarTablaSala() {


    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {
                for (let a of res.sussess) {

                    $("#bodytablaconsultarsala").append('<tr id="filaconsultarsala1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.nombre_edificio + '</td>\n\
                        <td>' + a.fila + ' x ' + a.columna + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarSala(' + a.id + ',' + a.edificio + ',`' + a.nombre + '`,' + a.fila + ',' + a.columna + ')">\n\
                                    <i class="fa fa-edit"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarSala(' + a.id + ');">\n\
                                    <i class="fa fa-remove"></i>\n\
                                </button>\n\
                            </span>\n\
                        </td>\n\
                        </tr>');
                }

                $("#table2").DataTable();

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }
        },
        error: function (err) {

            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });
}


function cargarInformacionActualizarSala(idsala, edificio, nombre, fila, columna) {

    $('#myModalActualizarSala').modal('show');

    $("#titulomodalactualizarsala").html("Actualizando sala con ID " + idsala);

    $('#actidsalaidentificador').val(idsala);
    $('#actidsalabloque').val(edificio);
    $('#actidsalasalon').val(nombre);
    $('#actidsalafila').val(fila);
    $('#actidsalacolumna').val(columna);

    $('#actidsalabloque > option[value="' + edificio + '"]').attr('selected', 'selected');


}

function actualizarSala() {


    let identificador = $("#actidsalaidentificador").val();
    let edificio = $("#actidsalabloque").val();
    let salon = $("#actidsalasalon").val();
    let fila = $("#actidsalafila").val();
    let columna = $("#actidsalacolumna").val();

    $.ajax({
        url: `${url}/salas/modificar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id: identificador,
            nombre: salon,
            torre: edificio,
            fila: fila,
            columna: columna
        },
        success: function (res) {
            if (res.success) {

                swal("Salon actualizado", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizarusuario")[0].reset();
                    $("#myModalActualizarSala").modal('hide');
                    cargarSeccionConsultarSala();

                });


            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });

}
function eliminarSala(id) {

    swal({
        title: "Deseas  eliminar la sala " + id + "?",
        text: "Una vez la sala eliminada no podra ser recuperada",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {

            $.ajax({
                url: `${url}/salas/eliminar`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.success) {

                        swal("Salon eliminado", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarSala();

                        });

                    } else if (res.err) {
                        let error = res.err;
                        swal("Problemas encontrados", error, "error");
                    }

                },
                error: function (err) {
                    swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
                }
            });

        }
    });

}

function cargarSeccionRegistrarHorario() {
    $(".seccioninfo").hide();
    $("#registrar-horario").show();

}


function cargarSeccionConsultarHorario() {
    $(".seccioninfo").hide();
    $("#consultar-horario").show();

}

function cargarSeccionRegistrarBeca() {
    $(".seccioninfo").hide();
    $("#registrar-beca").show();

}

function cargarSeccionConsultarBeca() {
    $(".seccioninfo").hide();
    $("#consultar-beca").show();

}

function cargarSeccionCodigoQR() {
    $(".seccioninfo").hide();
    $("#generar-qr").show();
}



function generarCodigoQR() {


    let mensaje = $("#idqrmensaje").val();
    $("#divbotoncodigo").show();

    $('#impresionCodigoQr').qrcode({
        render: 'canvas',
        minVersion: 6,
        maxVersion: 40,
        ecLevel: 'H',
        left: 0,
        top: 0,
        size: 200,
        fill: '#000',
        background: null,
        text: mensaje,
        radius: 0,
        quiet: 0,
        mode: 2,
        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'MUXBIRD',
        fontname: 'sans',
        fontcolor: '#3c8dbc',
        image: null
    });


}



function descargarCodigoQR() {
    var canvas = $("canvas");

    let mensaje = $("#idqrmensaje").val();

    var filename = mensaje;
    if (canvas.msToBlob) { //para internet explorer
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, filename + ".png");// la extensión de preferencia pon jpg o png
    } else {
        link = document.getElementById("botondescargarqr");
        //Otros navegadores: Google chrome, Firefox etc...        
        link.href = (canvas[0]).toDataURL("image/png");// Extensión .png ("image/png") --- Extension .jpg ("image/jpeg")

        link.download = filename;
    }
}