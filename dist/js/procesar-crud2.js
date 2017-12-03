

/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";
function cargarProfesor() {
    $.ajax({
        url: `${url}/usuario/listar_docentes`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {
            if (res.success) {
                for (let a of res.success) {
                    $("#idprofesormateria").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                    $("#actidprofesormateria").append('<option value=' + a.id + '>' + a.nombre + '</option>');
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
    $("#registrar-materias").show();
    cargarProfesor();
}


function cargarSeccionConsultarMateria() {
    $(".seccioninfo").hide();
    $("#consultar-materia").show();
    $("#table2").DataTable().destroy();
    $("#bodytablaconsultarmateria").empty();

    cargarTablaMateria();
    cargarProfesor();
}

function cargarTablaMateria() {
    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/materia/listar`,
        type: "GET",
        contentType: "application/json",
        processData: false,
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {
                for (let a of res.sussess) {

                    $("#bodytablaconsultarmateria").append('<tr id="filaconsultarmateria1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.docente + '</td>\n\
                        <td>' + a.descripcion + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarMateria(' + a.id + ',`' + a.nombre + '`,' + a.docente + ')">\n\
                                    <i class="fa fa-edit"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarMateria(' + a.id + ');">\n\
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


function cargarInformacionActualizarMateria(idmateria, nombre, docente) {
    $('#myModalActualizarMateria').modal('show');

    $("#titulomodalactualizarMateria").html("Actualizando Materia con ID " + idmateria);

    $('#actidmateriaidentificador').val(idmateria);
    $('#actidprofesormateria').val(docente);
    $('#actidcodigomateria').val(docente);
    $('#actidnombremateria').val(nombre);
    $('#actidgrupomateria').val(docente);

    $('#actidprofesormateria > option[value="' + docente + '"]').attr('selected', 'selected');


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

function registrarMateria() {

    let profesor = $("#idprofesormateria").val();
    let codigo = $("#idcodigomateria").val();
    let nombre = $("#idnombremateria").val();
    let grupo = $("#idgrupomateria").val();
    $.ajax({
        url: `${url}/materia/registrar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            nombre: nombre,
            grupo: grupo,
            docente: profesor,
            codigo: codigo
        },
        success: function (res) {
            alert(res.success);
            if (res.success) {
                swal("Materia registrada", "Haga click en el boton para regresar", "success");
                $("#formagregarmateria")[0].reset();

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

function actualizarMateria() {


    let identificador = $("#actidmateriaidentificador").val();
    let profesor = $("#actidprofesormateria").val();
    let codigo = $("#actidcodigomateria").val();
    let nombre = $("#actidnombremateria").val();
    let grupo = $("#actidgrupomateria").val();

    $.ajax({
        url: `${url}/materia/modificar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id: identificador,
            nombre: nombre,
            descripcion: codigo,
            docente: profesor,
           },
        success: function (res) {
            if (res.success) {

                swal("Materia actualizada", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizarusuario")[0].reset();
                    $("#myModalActualizarMateria").modal('hide');
                    cargarSeccionConsultarMateria();

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


function eliminarMateria(id) {

    swal({
        title: "Deseas  eliminar la materia " + id + "?",
        text: "Una vez eliminada no podra ser recuperada",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
alert('entro: '+ id);
            $.ajax({
                url: `${url}/materia/eliminar`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    console.log(res);
                    if (res.success) {

                        swal("Materia eliminada", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarMateria();

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

