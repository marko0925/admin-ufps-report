
/* global swal */

var url = "http://35.227.122.71/servicioApp/index.php";
var profesor = '';
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
//Consulta ajax para obtener el nombre del profesor
                    $.ajax({
                        url: `${url}/usuario/listar_docentes`,
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        data: null,

                        success: function (res) {
                            if (res.success) {
                                for (let p of res.success) {
                                    if (p.id == a.docente) {
//----------------------------------------------------------------
                                        $("#bodytablaconsultarmateria").append('<tr id="filaconsultarmateria1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td>' + a.grupo + '</td>\n\
                        <td>' + a.codigo + '</td>\n\
                        <td>' + p.nombre + '</td>\n\
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
                                        //cerrar el codigo de la consulta ajax para obtener el nombre del profesor
                                    }
                                }

                            }
                        }
                    });

//-----------------------------------------------------------------------------------
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


function cargarInformacionActualizarMateria(idmateria, nombre, codigo, grupo, docente) {
    $('#myModalActualizarMateria').modal('show');

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
    $(".seccioninfo").hide();
    $("#registrar-dispositivo").show();
    cargarSalasDispositivo();
}

function cargarSeccionConsultarDispositivo() {
    $(".seccioninfo").hide();
    $("#consultar-dispositivo").show();
    $("#table3").show();
    $(".s2").hide();
    $("#table2").DataTable().destroy();
    $("#bodytablaconsultardispositivo").empty();
    $("#bodytablaconsultarsala2").empty();
    cargarSalasDispositivo();
    cargarTablaSala2();
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
                swal("Dispositivo registrado", "Haga click en el boton para regresar", "succes");
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
}


function cargarTablaDispositivo(idsala) {
    $("#table2").DataTable().destroy();
    $("#bodytablaconsultardispositivo").empty();
    $("#table3").hide();
    $("#nombresala").html("Sala: " + idsala);

    $(".s2").show();
    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");


    //Consulta ajax para obtener el nombre de la sala
    $.ajax({
        url: `${url}/salas/visualizar`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: {
            id:idsala
        },

        success: function (res) {

            console.log(res);
            if (res.success) {
                let p = res.success
//                                  
//----------------------------------------------------------------


                $.ajax({
                    url: `${url}/dispositivo/listar`,
                    type: "GET",
                    contentType: "application/json",
                    data: {
                        sala: idsala
                    },
                    success: function (res) {
                        console.log('dis:'+res);
                        let tipo = '';
                        $(".swal-overlay").remove();

                        if (res.sussess) {
                            for (let a of res.sussess) {
                                if (a.tipo == 1) {
                                    tipo = 'Computador';
                                } else if (a.tipo == 2) {
                                    tipo = 'Video Beam';
                                } else
                                if (a.tipo == 1) {
                                    tipo = 'Minicomponente';
                                }

                        $("#bodytablaconsultardispositivo").append('<tr id="filaconsultardispositivo1">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.numero + '</td>\n\
                        <td>' + a.numero_reportes + '</td>\n\
                        <td>' + tipo + '</td>\n\
                        <td>' + p.nombre + '</td>\n\
                        <td>' + a.fila + '</td>\n\
                        <td>' + a.columna + '</td>\n\
                        <td>' + a.estado + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Actualizar">\n\
                                <button type="submit" class="btn btn-primary btn-xs" onclick="cargarInformacionActualizarDispositivo(' + a.id + ',' + a.numero + ',' + a.salon + ',' + a.id + ',' + a.id + ')">\n\
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



//cerrar el codigo de la consulta ajax para obtener el nombre de la sala


            }
        }
    });
//-----------------------------------------------------------------------------------
}




function cargarTablaSala2() {


    swal("Cargando información.", "La ventana se cerrara automáticamente.", "info");

    $.ajax({
        url: `${url}/salas/listar`,
        type: "GET",
        contentType: "application/json",
        data: null,

        success: function (res) {

            $(".swal-overlay").remove();

            if (res.sussess) {
                for (let a of res.sussess) {

                    $("#bodytablaconsultarsala2").append('<tr id="filaconsultarsala12">\n\
                        <td>' + a.id + '</td>\n\
                        <td>' + a.nombre + '</td>\n\
                        <td class="text-center">\n\
                            <span id="tooltipModificar" data-toggle="tooltip" data-placement="top" title="Ver Dispositivos">\n\
                                <button type="submit" class="btn btn-success btn-xs" onclick="cargarTablaDispositivo(' + a.id + ')">\n\
                                    <i class="fa fa-desktop"></i>\n\
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


function cargarInformacionActualizarDispositivo(idDispositivo, numero, salon, fila, columna) {
    $('#myModalActualizarDispositivo').modal('show');

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
                    $("#formactualizarusuario")[0].reset();
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
    $(".seccioninfo").hide();
    $("#registrar-edificio").show();
}

function cargarSeccionConsultarEdificio() {
    $(".seccioninfo").hide();
    $("#consultar-edificio").show();
    $("#table2").DataTable().destroy();
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
