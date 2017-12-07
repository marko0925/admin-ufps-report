
/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";
var profesor = '';
function cargarSeccionRegistrarMateria() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#registrar-materias").show();
    cargarProfesor();
}


function cargarSeccionConsultarMateria() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-materia").show();

    $('.datablepersonalizada').DataTable().destroy();
    $("#bodytablaconsultarmateria").empty();

    cargarTablaMateria();
    cargarProfesor();
}

function obtenerNombreProfesor(idprofesor) {

    $.ajax({
        url: `${url}/usuario/listar_docentes`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: null,

        success: function (res) {
            if (res.success) {
                for (let a of res.success) {
                    if (a.id == idprofesor) {

                        profesor = a.nombre;
                        alert(a.nombre);
                        return a.nombre;
                    }
                }

            }
        }
    });
}

function cargarProfesor() {


    $("#idprofesormateria").empty();
    $("#actidprofesormateria").empty();

    $.ajax({
        url: `${url}/usuario/listar_docentes`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
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



function cargarTablaMateria() {
    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/materia/listar`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {

                for (let a of res.sussess) {
                    $("#bodytablaconsultarmateria").append('<tr id="filaconsultarmateria1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.grupo + '</td>\n\
                        <td>' + a.codigo + '</td>\n\
                        <td>' + a.nombre_docente + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarMateria(' + a.id + ',`' + a.nombre + '`,' + a.codigo + ',`' + a.grupo + '`,' + a.docente + ')">\n\
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


function cargarInformacionActualizarMateria(idmateria, nombre, codigo, grupo, docente) {
    $('#myModalActualizarMateria').modal('show');

    $('option').removeAttr("selected");
    $("#titulomodalactualizarMateria").html("Actualizando Materia con ID " + idmateria);

    $('#actidmateriaidentificador').val(idmateria);
    $('#actidprofesormateria').val(docente);
    $('#actidcodigomateria').val(codigo);
    $('#actidnombremateria').val(nombre);
    $('#actidgrupomateria').val(grupo);

    $('#actidprofesormateria > option[value="' + docente + '"]').attr('selected', 'selected');
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
    return false;
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
            grupo: grupo,
            docente: profesor,
            codigo: codigo
        },
        success: function (res) {
            if (res.success) {

                swal("Materia actualizada", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizarmateria")[0].reset();
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



function cargarSeccionRegistrarDispositivo() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#registrar-dispositivo").show();
    cargarSalasDispositivo();
}

function cargarSeccionConsultarDispositivo() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-dispositivo").show();
    
    $("#table3").DataTable().destroy();
    $("#table3").show();

    $(".datablepersonalizada").DataTable().destroy();

    $("#bodytablaconsultardispositivo").empty();
    $("#bodytablaconsultarsala2").empty();
    cargarSalasDispositivo();
    cargarTablaSala2();
    $("#nombresala").html("Seleccione la sala para observar los dispositivos dentro de ella");
    $("#volver").hide();
}



function cargarSalasDispositivo() {


    $("#idsaladispositivos").empty();
    $("#actidsaladispositivo").empty();
    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: null,

        success: function (res) {
            if (res.sussess) {
                for (let a of res.sussess) {
                    $("#idsaladispositivos").append('<option value=' + a.id + '>' + a.nombre + '</option>');
                    $("#actidsaladispositivo").append('<option value=' + a.id + '>' + a.nombre + '</option>');
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


function registrarDispositivo() {

    let tipo = $("#idtipodispositivo").val();
    let codigo = $("#idcodigodispositivo").val();
    let referencia = $("#idreferenciadispositivo").val();
    let fila = $("#idfiladispositivo").val();
    let columna = $("#idcolumnadispositivo").val();
    let sala = $("#idsaladispositivos").val();

    if (tipo == 2) {
        fila = -2;
        columna = -2;
    }
    if (tipo == 3) {
        fila = -1;
        columna = -1;
    }


    $.ajax({
        url: `${url}/dispositivo/registrar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            numero: codigo,
            referencia: referencia,
            salon: sala,
            tipo: tipo,
            fila: fila,
            columna: columna
        },
        success: function (res) {
            if (res.succes) {
                swal("Dispositivo registrado", "Haga click en el boton para regresar", "success");
                $("#formagregardispositivo")[0].reset();

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


function cargarTablaDispositivo(idsala, nombresala) {

    $("#bodytablaconsultardispositivo").empty();
    $("#table3").DataTable().destroy();
    $("#bodytablaconsultarsala2").empty();
    $("#table3").hide();


    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/dispositivo/listar`,
        type: "GET",
        contentType: "application/json",
        data: {
            sala: idsala
        },
        success: function (res) {
            console.log(res);
            let tipo = '';
            let estado = '';
            let fila = '';
            let columna = '';
            $(".swal-overlay").remove();

            if (res.sussess) {
                console.log(res);
                let b = res.sussess
                if (res.sussess.length == 0) {
                    swal("La sala: " + nombresala + " aun no cuenta con dispositivos", "Haga click en el boton para regresar", "error").then((value) => {
                        cargarSeccionConsultarDispositivo();

                    });

                } else {
                    $("#nombresala").html("Consulta de dispositivos - Sala: " + nombresala);
                    $("#table2").show();

                    for (let a of res.sussess) {
                        if (a.tipo == 1) {
                            tipo = 'Computador';
                            if (a.fila == '-1') {
                                a.fila = 'Null';
                            }

                            if (a.columna == '-1') {
                                a.columna = 'Null';
                            }


                        } else if (a.tipo == 2) {
                            tipo = 'Video Beam';

                        } else
                        if (a.tipo == 3) {
                            tipo = 'Minicomponente';
                        }
                        if (a.estado == true) {
                            estado = 'Al dia';
                        } else {
                            estado = 'Averiado';
                        }

                        $("#bodytablaconsultardispositivo").append('<tr id="filaconsultardispositivo1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.numero + '</td>\n\
                        <td>' + a.numero_reportes + '</td>\n\
                        <td>' + tipo + '</td>\n\
                        <td>' + a.fila + '</td>\n\
                        <td>' + a.columna + '</td>\n\
                        <td>' + estado + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipGenerarQR" data-toggle="tooltip" data-placement="top" title="Generar QR">\n\
                                <button type="submit" class="btn btn-success btn-xs" onclick="generarMensajeparaQR(' + a.numero + ')">\n\
                                    <i class="fa fa-barcode"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarDispositivo(' + a.id + ',' + a.numero + ',' + a.salon + ',' + a.fila + ',' + a.columna + ')">\n\
                                    <i class="fa fa-edit"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarDispositivo(' + a.id + ');">\n\
                                    <i class="fa fa-remove"></i>\n\
                                </button>\n\
                            </span>\n\
                        </td>\n\
                        </tr>');

                    }
                    $("#volver").show();
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




function cargarTablaSala2() {
    $("#table2").DataTable().destroy();
    $("#bodytablaconsultardispositivo").empty();
    $("#table2").hide();

    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {
                console.log(res);
                for (let a of res.sussess) {

                    $("#bodytablaconsultarsala2").append('<tr id="filaconsultarsala12">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre_edificio + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Ver Dispositivos">\n\
                                <button type="submit" class="btn btn-vimeo btn-xs" onclick="cargarTablaDispositivo(' + a.id + ',`' + a.nombre + '`)">\n\
                                    <i class="fa fa-desktop"></i>\n\
                                </button>\n\
                            </span>\n\
                          </td>\n\
                        </tr>');
                }
                $("#volver").hide();
                $("#table3").DataTable();

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


function cargarInformacionActualizarDispositivo(idDispositivo, numero, salon, fila, columna) {
    $('#myModalActualizarDispositivo').modal('show');

    $('option').removeAttr("selected");
    $("#titulomodalactualizarDispositivo").html("Actualizando Dispositivo con ID " + idDispositivo);

    $('#actiddispositivoidentificador').val(idDispositivo);

    $('#actidnumerodispositivo').val(numero);

    $('#actidsaladispositivo').val(salon);

    $('#actidfiladispositivo').val(fila);

    $('#actidcolumnadispositivo').val(columna);

    $('#actidsaladispositivo > option[value="' + salon + '"]').attr('selected', 'selected');
}



function actualizarDispositivo() {


    let identificador = $("#actiddispositivoidentificador").val();
    let sala = $("#actidsaladispositivo").val();
    let numero = $("#actidnumerodispositivo").val();
    let fila = $("#actidfiladispositivo").val();
    let columna = $("#actidcolumnadispositivo").val();

    $.ajax({
        url: `${url}/dispositivo/modificar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id: identificador,
            numero: numero,
            salon: sala,
            fila: fila,
            columna: columna
        },
        success: function (res) {
            if (res.success) {

                swal("Dispositivo actualizado", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizardispositivo")[0].reset();
                    $("#myModalActualizarDispositivo").modal('hide');
                    cargarSeccionConsultarDispositivo();

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


function eliminarDispositivo(id) {

    swal({
        title: "Deseas  eliminar el dispositivo " + id + "?",
        text: "Una vez eliminado no podra ser recuperada",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: `${url}/dispositivo/eliminar`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    console.log(res);
                    if (res.success) {

                        swal("Dispositivo eliminado", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarDispositivo();

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



function cargarSeccionRegistrarEdificio() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#registrar-edificio").show();
}

function cargarSeccionConsultarEdificio() {
    vaciar_header();
    $(".seccioninfo").hide();
    $("#consultar-edificio").show();
    $(".datablepersonalizada").DataTable().destroy();
    $("#bodytablaconsultaredificio").empty();

    cargarTablaEdificio();
}


function registrarEdificio() {

    let nombre = $("#idnombreedificio").val();

    $.ajax({
        url: `${url}/edificio/registrar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            nombre: nombre,
        },
        success: function (res) {
            if (res.success) {
                swal("Edificio registrado", "Haga click en el boton para regresar", "success");
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
    
        return false;

}


function cargarTablaEdificio() {
    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");
    $.ajax({
        url: `${url}/edificio/listar`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {
            $(".swal-overlay").remove();
            if (res.success) {
                for (let a of res.success) {
                    $("#bodytablaconsultaredificio").append('<tr id="filaconsultaredificio1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarEdificio(' + a.id + ',`' + a.nombre + '`)">\n\
                                    <i class="fa fa-edit"></i>\n\
                                </button>\n\
                            </span>\n\
                            <span id="tooltipEliminar" data-toggle="tooltip" data-placement="top" title="Eliminar">\n\
                                <button type="submit" class="btn btn-warning btn-xs" onclick="return eliminarEdificio(' + a.id + ');">\n\
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

function cargarInformacionActualizarEdificio(id, nombre) {
    $('#myModalActualizarEdificio').modal('show');

    $("#titulomodalactualizaredificio").html("Actualizando Edificio con ID " + id);

    $('#actidedificioidentificador').val(id);
    $('#actidnombreedificio').val(nombre);

}



function actualizarEdificio() {


    let id = $("#actidedificioidentificador").val();
    let nombre = $("#actidnombreedificio").val();


    $.ajax({
        url: `${url}/edificio/modificar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id: id,
            nombre: nombre,

        },
        success: function (res) {
            if (res.success) {

                swal("Edificio actualizado", "Haga click en el boton para regresar", "success").then((value) => {
                    $("#formactualizaredificio")[0].reset();
                    $("#myModalActualizarEdificio").modal('hide');
                    cargarSeccionConsultarEdificio();

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


function eliminarEdificio(id) {

    swal({
        title: "Deseas  eliminar el edificio " + id + "?",
        text: "Una vez eliminado no podra ser recuperada",
        icon: "error",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: `${url}/edificio/eliminar`,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                data: {
                    id: id
                },
                success: function (res) {
                    console.log(res);
                    if (res.success) {

                        swal("Edificio eliminado", "Haga click en el boton para regresar", "success").then((value) => {
                            cargarSeccionConsultarEdificio();

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
//------------------------------------------------------------------------------------------------------