

/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";
function cargarSeccionRegistrarSala() {

    vaciar_header();
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
    return false;
}

function cargarSeccionConsultarSala() {

    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-salas").show();

    $('.datablepersonalizada').DataTable().destroy();
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

                $(".datablepersonalizada").DataTable();

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
                    $("#formactualizarsala")[0].reset();
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
    return false;
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

    vaciar_header();
    $(".seccioninfo").hide();
    $("#registrar-horario").show();

    $("#idhorarioselectmateriaregistrar").empty();
    $("#idhorarioselectsala").empty();

    cargarSelectMateria();

    cargarSelectSala();
}


function registrarHorario() {

    let dia = $("#idhorariodia").val();
    let hora = $("#idhorariohora").val();
    let materia = $("#idhorarioselectmateriaregistrar").val();
    let sala = $("#idhorarioselectsala").val();
    
    alert(dia +" "+hora+" "+materia+" "+sala);
    $.ajax({
        url: `${url}/materia/asignar_horario`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            materia: materia,
            hora: hora,
            dia: dia,
            salon: sala
        },
        success: function (res) {
            if (res.success) {

                swal("Horario registrado", "Haga click en el boton para regresar", "success");
                $("#formagregarhorario")[0].reset();

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });
    return false;
}




function cargarSeccionConsultarHorario() {

    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-horario").show();


    $('.datablepersonalizada').DataTable().destroy();

    $("#bodytablaconsultarhorario").empty();


    cargarTablaHorarioPorMateria();


}
function cargarTablaHorarioPorMateria() {

    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/materia/listar`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {


                $("#volverAtrasHorario").hide();
                $("#tituloboxconsultarhorario").html("Seleccione la materia para observar su horario");
                $("#encabezadotablahorario").html(`<th class="text-center">ID</th>
                    <th class="text-center">Nombre</th>
                    <th class="text-center">Grupo</th>
                    <th class="text-center">Codigo</th>
                    <th class="text-center">Salon</th>
                    <th class="text-center">Ver horario</th>`);

                for (let a of res.sussess) {
                    $("#bodytablaconsultarhorario").append('<tr id="filaconsultarhorario1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.grupo + '</td>\n\
                        <td>' + a.codigo + '</td>\n\
                        <td>' + a.nombre_docente + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipHorario" data-toggle="tooltip" data-placement="top" title="Horario">\n\
                                <button type="submit" class="btn btn-success btn-xs" onclick="cargarTablaHorario(' + a.id + ',' + a.codigo + ')">\n\
                                    <i class="fa fa-book"></i>\n\
                                </button>\n\
                            </span>\n\
                            \n\
                        </td>\n\
                        </tr>');
                }
                $(".datablepersonalizada").DataTable();

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



function cargarSelectMateria() {

    $("#idhorariomateria").empty();

    $.ajax({
        url: `${url}/materia/listar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: null,

        success: function (res) {

            if (res.sussess) {
                for (let a of res.sussess) {
                    $("#idhorarioselectmateria").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                    $("#idhorarioselectmateriaregistrar").append('<option value=' + a.id + '>' + a.nombre + '</option>');

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


function cargarSelectSala() {

    $("#idhorarioselectsala").empty();

    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: null,

        success: function (res) {

            if (res.sussess) {
                for (let a of res.sussess) {
                    $("#idhorarioselectsala").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                    $("#actidhorarioselectsala").append('<option value=' + a.id + '>' + a.nombre + '</option>');

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

function cargarTablaHorario(idmateria, codigo) {



    $('.datablepersonalizada').DataTable().destroy();
    $("#tablaconsultarhorario").hide();

    $("#bodytablaconsultarhorario").empty();

    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $('#actidhorarioselectsala').empty();
    cargarSelectSala();

    $.ajax({
        url: `${url}/materia/listar_horario`,
        type: "GET",
        contentType: "application/json",
        data: {
            materia: idmateria
        },

        success: function (res) {

            $(".swal-overlay").remove();
            $("#tablaconsultarhorario").show();

            if (res.sussess) {

                $("#volverAtrasHorario").show();
                $("#tituloboxconsultarhorario").html("Consultar horario - Materia: " + codigo);

                $("#encabezadotablahorario").html(`<th class="text-center">ID</th>
                    <th class="text-center">Dia</th>
                    <th class="text-center">Hora</th>
                    <th class="text-center">Salon</th>
                    <th class="text-center">Opciones</th>`);
                for (let a of res.sussess) {

                    $("#bodytablaconsultarhorario").append('<tr id="filaconsultarhorario1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre_dia + '</td>\n\
                        <td>' + a.hora + '</td>\n\
                        <td>' + a.nombre_salon + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarHorario(' + a.id + ',' + a.dia + ',`' + a.hora + '`,' + a.salon + ')">\n\
                                    <i class="fa fa-edit"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarHorario(' + a.id + ');">\n\
                                    <i class="fa fa-remove"></i>\n\
                                </button>\n\
                            </span>\n\
                        </td>\n\
                        </tr>');
                }

                $(".datablepersonalizada").DataTable();

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


function cargarInformacionActualizarHorario(id, dia, hora, salon) {


    $('#myModalActualizarHorario').modal('show');
    $("#titulomodalactualizarhorario").html("Actualizando horario con ID " + id);



    $('#actidhorarioidentificador').val(id);

    $('option').removeAttr("selected");

    $('#actidhorariodia > option[value="' + dia + '"]').attr('selected', 'selected');


    $('#actidhorariohora > option[value="' + hora + '"]').attr('selected', 'selected');


    $('#actidhorarioselectsala > option[value="' + salon + '"]').attr('selected', 'selected');


}


function actualizarHorario() {


    var materia = $("#idhorarioselectmateria").val();
    let identificador = $("#actidhorarioidentificador").val();
    let dia = $("#actidhorariodia").val();
    let hora = $("#actidhorariohora").val();
    let sala = $("#actidhorarioselectsala").val();
    $.ajax({
        url: `${url}/materia/modificar_horario`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id: identificador,
            hora: hora,
            salon: sala,
            materia: materia,
            dia: dia
        },
        success: function (res) {
            if (res.success) {

                swal("Horario actualizado", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizarhorario")[0].reset();
                    $("#myModalActualizarHorario").modal('hide');
                    cargarSeccionConsultarHorario();

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
    return false;
}

function eliminarHorario(id) {

    swal({
        title: "Deseas  eliminar el horario " + id + "?",
        text: "Una vez el horario eliminado no podra ser recuperado",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {

            $.ajax({
                url: `${url}/materia/eliminar_hora`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.success) {

                        swal("Horario eliminado", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarHorario();

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


function cargarSeccionRegistrarBeca() {

    vaciar_header();
    $(".seccioninfo").hide();
    $("#registrar-beca").show();

}

function registrarBeca() {

    let correo = $("#idbecacorreo").val();

    $.ajax({
        url: `${url}/usuario/registrar_beca`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            correo: correo
        },
        success: function (res) {
            if (res.success) {

                swal("Beca registrado", "Haga click en el boton para regresar", "success");
                $("#formagregarbeca")[0].reset();

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });
    return false;
}

function cargarSeccionConsultarBeca() {

    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-beca").show();

    $('.datablepersonalizada').DataTable().destroy();
    $("#bodytablaconsultarbeca").empty();

    cargarTablaBeca();
}


function cargarTablaBeca() {


    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/usuario/listar_becas`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.success) {
                for (let a of res.success) {

                    $("#bodytablaconsultarbeca").append('<tr id="filaconsultarbeca1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.correo + '</td>\n\
                        <td>' + a.codigo + '</td>\n\
                        <td class="text-center">\n\
                            \n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarBeca(' + a.id + ');">\n\
                                    <i class="fa fa-remove"></i>\n\
                                </button>\n\
                            </span>\n\
                        </td>\n\
                        </tr>');
                }

                $(".datablepersonalizada").DataTable();

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


function eliminarBeca(id) {

    swal({
        title: "Deseas  eliminar el beca " + id + "?",
        text: "Una vez el beca eliminado no podra ser recuperado",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {

            $.ajax({
                url: `${url}/usuario/eliminar_beca`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.success) {

                        swal("Beca eliminado", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarBeca();

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

function generarMensajeparaQR(numero) {


    swal("Generando codigo QR.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/reporte/buscar_qr`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            numero: numero
        },
        success: function (res) {

            $(".swal-overlay").remove();
            if (res.succes) {

                $('#myModalGenerarQR').modal('show');

                $("#titulomodalgenerarqr").html("Codigo QR del dispositivo con numero: " + numero);

                let respuesta = res.succes;

                $('#modalImpresionCodigoQr').html("");
                $('#identificadorcodigoqr').val(respuesta);
                generarCodigoQR(respuesta);

            } else if (res.err) {
                let error = res.err;
                swal("Problemas encontrados", error, "error");
            }

        },
        error: function (err) {
            swal("Problemas encontrados", "Existe un problema entre la peticion y el servidor", "error");
        }
    });
    return false;
}


function generarCodigoQR(mensaje) {


    $("#modaldivbotoncodigo").show();

    $('#modalImpresionCodigoQr').qrcode({
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
    let mensaje = $('#identificadorcodigoqr').val();

    var canvas = $("canvas");

    var filename = mensaje;
    if (canvas.msToBlob) { //para internet explorer
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, filename + ".png");// la extensión de preferencia pon jpg o png
    } else {
        link = document.getElementById("modalbotondescargarqr");
        //Otros navegadores: Google chrome, Firefox etc...        
        link.href = (canvas[0]).toDataURL("image/png");// Extensión .png ("image/png") --- Extension .jpg ("image/jpeg")

        link.download = filename;
    }
}