
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
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {

            if (res.success) {
                for (let a of res.success) {
                    $("#idsalabloque").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                }

            } else if (res.err) {
                swal("Problemas encontrados", res.err, "error");
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

    alert(edificio + salon + fila + columna);
    $.ajax({
        url: `${url}/salas/registrar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({

            nombre: salon,
            edificio: edificio,
            fila: fila,
            columna: columna
        }),
        success: function (res) {
            if (res.success) {

                swal("Salon registrado", "Haga click en el boton para regresar", "success");

            } else if (res.err) {
                console.log(res.err);
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            console.log(err);
            swal("Problemas encontrados", "err", "error");
        }
    });

}

function cargarSeccionConsultarSala() {
    $(".seccioninfo").hide();
    $("#consultar-salas").show();
    $("#bodytablaconsultarsala").empty();


    cargarSala();

}

function cargarSala() {

    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {

            console.log("entro");
            console.log(res);
            if (res.sussess) {
                console.log("entro 2");
                for (let a of res.sussess) {
                    console.log("sdsd");
                    console.log(a);

                    $("#bodytablaconsultarsala").append('<tr id="filaconsultarsala1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.edificio + '</td>\n\
                        <td>' + a.fila + ' x ' + a.columna + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="return actualizarSala(' + a.id + ');">\n\
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

            } else if (res.err) {
                swal("Problemas encontrados", res.err, "error");
            }
        },
        error: function (err) {

            swal("Problemas encontrados", err, "error");
        }
    });
}


function actualizarSala(id) {
    console.log("noooooooooooooooooo" + id);
    $('#myModalActualizarSala').modal('show');

    //titulomodalactualizarsala
}

function eliminarSala(id) {
    alert("asd´" + id);
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

