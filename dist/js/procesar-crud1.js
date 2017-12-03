

var url = "https://3888f885.ngrok.io";
function cargarSeccionRegistrarSala() {


    $(".seccioninfo").hide();
    $("#registrar-salas").show();

    cargarEdificio();

}

function cargarEdificio() {

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

    cargarSala();

}

function cargarSala() {


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
                        <td>' + a.edificio + '</td>\n\
                        <td>' + a.fila + ' x ' + a.columna + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="actualizarSala(' + a.id + ',' + a.edificio + ',`' + a.nombre + '`,' + a.fila + ',' + a.columna + ')">\n\
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


function actualizarSala(idsala, edificio, nombre, fila, columna) {

    $('#myModalActualizarSala').modal('show');


    $("#titulomodalactualizarsala").html("Actualizando sala con ID " + idsala);

    $('#actidsalabloque').val(edificio);
    $('#actidsalasalon').val(nombre);
    $('#actidsalafila').val(fila);
    $('#actidsalacolumna').val(columna);


}

function eliminarSala(id) {
    alert("elimnar queeeeeeee´" + id);
    cargarSeccionConsultarSala();
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

function cargarSeccionRegistrarMateria() {
    $(".seccioninfo").hide();
    $("#registrar-materia").show();

}

function cargarSeccionConsultarMateria() {
    $(".seccioninfo").hide();
    $("#consultar-materia").show();

}


function cargarSeccionRegistrarDispositivo() {
    $(".seccioninfo").hide();
    $("#registrar-dispositivo").show();

}

function cargarSeccionConsultarDispositivo() {
    $(".seccioninfo").hide();
    $("#consultar-dispositivo").show();

}

