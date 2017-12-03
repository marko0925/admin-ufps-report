

/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";

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


function registrarDispositivo() {

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