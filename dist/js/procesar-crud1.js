
var url = "https://d44bbd90.ngrok.io";
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

            swal("Problemas encontrados", err, "error");
        }
    });
}

function registrarSala() {


    let bloque = $("#idsalabloque").val();
    let salon = $("#idsalasalon").val();
    let fila = $("#idsalafila").val();
    let columna = $("#idsalacolumna").val();



    $.ajax({
        url: `${url}/salas/registrar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({
            id: bloque
        }),
        success: function (res) {

        },
        error: function (err) {

        }
    })


}

function cargarSeccionConsultarSala() {
    $(".seccioninfo").hide();
    $("#consultar-salas").show();

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

