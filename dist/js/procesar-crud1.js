
var url = "https://d44bbd90.ngrok.io";

function registrarSala(bloque, salon) {
    $(".seccioninfo").hide();
    $("#registrar-salas").show();

    cargarBloque();


}

function cargarBloque() {


    $.ajax({
        url: `${url}/edificio/listar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: null,
        success: function (res) {

            $("#idsalabloque").html(res);
        },
        error: function (err) {

            $("#idsalabloque").html(err);
        }
    });

}

function consultarSala() {
    $(".seccioninfo").hide();
    $("#consultar-salas").show();

}

function registrarHorario() {
    $(".seccioninfo").hide();
    $("#registrar-horario").show();

}

function registrarHorario() {
    $(".seccioninfo").hide();
    $("#registrar-horario").show();

}

function consultarHorario() {
    $(".seccioninfo").hide();
    $("#consultar-horario").show();

}

function registrarBeca() {
    $(".seccioninfo").hide();
    $("#registrar-beca").show();

}

function consultarBeca() {
    $(".seccioninfo").hide();
    $("#consultar-beca").show();

}

function registrarMateria() {
    $(".seccioninfo").hide();
    $("#registrar-materia").show();

}

function consultarMateria() {
    $(".seccioninfo").hide();
    $("#consultar-materia").show();

}


function registrarDispositivo() {
    $(".seccioninfo").hide();
    $("#registrar-dispositivo").show();

}

function consultarDispositivo() {
    $(".seccioninfo").hide();
    $("#consultar-dispositivo").show();

}

