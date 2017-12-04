var reports = [];
var instrumentos = [];
var salas = [];
var onOpen = false; // se quita
var url = "http:127.0.0.1:8000";
var reportSelected; //se quita
var correo = localStorage.getItem("correo");

$(".logo").attr("href", "/")
if (correo) {
    $("#tipo").html(localStorage.getItem("nombre")).addClass("big-first-letter");
    ctrlPages($("#pageLogin"), $("#pageReport"));
    loadEdificios();
}

/**
 * Funcion asincrona para soclitiar el inicio de sesion
 */
function signIn() {
    event.preventDefault();
    let correo = $("input[name='correo']").val();
    let contrasena = $("input[name='contrasena']").val();
    let tipo = $("select[name='tipo']").val();
    console.log(correo, contrasena, tipo)
    if (!correo || !contrasena || !tipo) {
        $("#msg").html(`<div class="alert alert-danger alert-dismissible" style="margin-top:20px;">
                 <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                 <h4><i class="icon fa fa-ban"></i>Datos vacios</h4>
                 Asegurate de digitar todos los datos.
               </div>`);
        resetInputs();
        return false;
    } else {
        $.ajax({
            url: `${url}/validar`,
            type: "GET",
            contentType: "application/json",
            data: {
                correo: correo,
                contrasena: contrasena,
                tipo: tipo
            },
            success: function (res) {
                if (res.success) {
                    $("#msg").html("");
                    console.log(res);
                    for (let item in res.success) {
                        localStorage.setItem(item, res.success[item]);
                    }
                    $("#tipo").html(localStorage.getItem("nombre")).addClass("big-first-letter");

                    loadEdificios();
                    ctrlPages($("#pageLogin"), $("#pageReport"));
                } else {
                    $(".content-header").html(`<div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i>Algo ha ido mal</h4>
                    ${res.err}.
                  </div>`);
                }
                return false;
            },
            error: function (err) {
                console.log("ERR,", err);
                return false;
            }
        })

    }

}

function salir() {
    localStorage.clear();
    ctrlPages($("#pageReport"), $("#pageLogin"));
}

/**
 * Function para mostrar y ocultar paginas
 * @param {*Pagina a ocultar} pageToHide 
 * @param {*Pagina a mostrar} pageToShow 
 */
function ctrlPages(pageToHide, pageToShow) {

    pageToHide.addClass("hide-section");
    pageToShow.removeClass("hide-section");
}

/**
 * Function para resetear los inputs del login
 */
function resetInputs() {
    $("input[name='codigo']").val("");
    $("input[name='contrasena']").val("")
}

function ufpsReportMsg() {
    $(".section-instrument").html(`
        <div class="ufps-report">
        <span><b>UFPS</b> REPORT</span>
        </div>
    `);
}

function loadEdificios() {
    loading();
    $.ajax({
        url: `${url}/edificio/listar`,
        type: "GET",
        contentType: "application/json",
        success: function (res) {
            ufpsReportMsg();
            console.log(res);
            let edificiosListado = [];
            if (res.success) {

                for (let edificio of res.success) {
                    edificiosListado.push(`
        <li class="treeview" >
            <a href="#">
                <i class="fa fa-circle"></i>
                <span>${edificio.nombre}</span>
                <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                </span>
            </a>
            <ul class="treeview-menu upper" id="edificio-${edificio.id}">

            </ul>
        </li>`);
                }
                $("#ul-edificios").html(edificiosListado.join(""));
                loadSalas();
            } else if (res.error) {

            }
        },
        error: function (err) {

        }
    });
}


function loadSalas() {
    $.ajax({
        url: `${url}/salas/listar`,
        type: "POST",
        contentType: "application/json",
        success: function (res) {
            console.log(res);
            if (res) {
                salas = res.success;
                for (let sala of salas) {
                    let salaFormat = `
        <li class="treeview">
            <a href="#" onclick="loadDispositivos('${sala.id}','${sala.fila}','${sala.columna}')">
                <i class="fa fa-circle"></i>
                <span>${sala.nombre}</span>
                <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                </span>
            </a>
        </li>`;
                    $("#edificio-" + sala.edificio).html(
                        $("#edificio-" + sala.edificio).html() + salaFormat
                    );

                }
            } else if (res.error) {

            }
        },
        error: function (err) {

        }
    });
}

function hasReport(id_instrumento) {
    for (let report of reports) {
        if (report.id_instrumento === id_instrumento) {
            return report.id;
        }
    }
    return -1;
}



function loading() {
    $(".section-instrument").html(``);
    $(".section-instrument").html(`
        <div class="loading">
            
        </div>
    `)
}

function get_nombre_sala(id) {
    for (let item of salas) {
        if (item.id == id) {
            return item.nombre;
        }
    }
    return "none";
}



function loadDispositivos(idSala, filas, columnas) {
    $(".content-header").html(`
        <h1>
            Dispositivos
            <small>Dispositivos de la sala <strong id="sala" class="upper">${get_nombre_sala(idSala)}</strong></small>
        </h1>`)
    // loading();
    // $.ajax({
    //     url: `${url}/dispositivo/selectBySalon`,
    //     type: "POST",
    //     contentType: "application/json",
    //     processData: false,
    //     data: JSON.stringify({
    //         "id": idSala
    //     }),
    //     success: function (res) {
    let res = [{
        "id": 1,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 0,
        "estado": false
    }, {
        "id": 2,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 1,
        "estado": false
    }, {
        "id": 3,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 2,
        "estado": false
    }, {
        "id": 4,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 3,
        "estado": false
    }, {
        "id": 5,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 4,
        "estado": false
    }, {
        "id": 6,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 0,
        "columna": 5,
        "estado": false
    }, {
        "id": 7,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 0,
        "estado": false
    }, {
        "id": 8,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 1,
        "estado": false
    }, {
        "id": 9,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 2,
        "estado": false
    }, {
        "id": 10,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 3,
        "estado": false
    }, {
        "id": 11,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 4,
        "estado": false
    }, {
        "id": 12,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 1,
        "columna": 5,
        "estado": false
    }, {
        "id": 13,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 0,
        "estado": false
    }, {
        "id": 14,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 1,
        "estado": false
    }, {
        "id": 15,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 2,
        "estado": false
    }, {
        "id": 16,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 3,
        "estado": false
    }, {
        "id": 17,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 4,
        "estado": false
    }, {
        "id": 18,
        "numero_reportes": 0,
        "tipo": 1,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": 2,
        "columna": 5,
        "estado": false
    }, {
        "id": 19,
        "numero_reportes": 0,
        "tipo": 3,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": -1,
        "columna": -1,
        "estado": false
    }, {
        "id": 20,
        "numero_reportes": 0,
        "tipo": 2,
        "salon": 1,
        "created_at": null,
        "updated_at": null,
        "fila": -2,
        "columna": -2,
        "estado": false
    }]
    instrumentos = res;
    let contentFormat = [];

    $(".section-dispositivos").html(`
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 devices-left">
    
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 devices-right">
            
            </div>
            <div class="otros-devices">
                <div class="audio">
                
                </div>
                <div class="beam">
                
                </div>
            </div>
        `);

    let devicesLeftArray = [];
    let devicesRightArray = [];
    for (let i = 0; i < filas; i++) {
        devicesLeftArray.push(`<div class="row left-${i}">`);
        devicesRightArray.push(`<div class="row right-${i}">`);
        for (let j = 0; j < columnas; j++) {
            if (j >= columnas / 2) {
                devicesRightArray.push(`
                        <div class="col-lg-${12/(columnas/2)} col-md-${12/(columnas/2)} col-sm-${12/(columnas/2)} col-xs-${12/(columnas/2)} ${i}-${j}">
                        ${i}-${j}
                        ${loadDispositivoIndividual(i,j)}
                        </div>
                    `);
            } else {
                devicesLeftArray.push(`
                        <div class="col-lg-${12/(columnas/2)} col-md-${12/(columnas/2)} col-sm-${12/(columnas/2)} col-xs-${12/(columnas/2)} ${i}-${j}">
                        ${i}-${j}
                        ${loadDispositivoIndividual(i,j)}
                        </div>
                    `);
            }
        }
        devicesRightArray.push(`</div>`);
        devicesLeftArray.push(`</div>`);
        $(".devices-right").html(devicesRightArray.join(""));
        $(".devices-left").html(devicesLeftArray.join(""));
    }
    loadOtrosDevices();

    // },
    //     error: function (err) {

    //     }
    // })
}

function loadOtrosDevices() {
    for (let instrumento of instrumentos) {
        if (instrumento.fila == -2 && instrumento.columna == -2) {

            if (instrumento.tipo == 2) {
                if (!instrumento.estado) {
                    estado = "broken";
                    $(`.beam`).html(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                                            <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                } else {
                    estado = "working";
                    $(`.beam`).html(`<div class="instrument">
                                                            <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                }
            }
        } else if (instrumento.fila == -1 && instrumento.columna == -1) {
            if (instrumento.tipo == 3) {
                if (!instrumento.estado) {
                    estado = "broken";
                    $(`.audio`).html(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                                            <i class="fa fa-music ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                } else {
                    estado = "working";
                    $(`.audio`).html(`<div class="instrument" >
                                                            <i class="fa fa-music ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                }

            }
        }
    }
}

function loadDispositivoIndividual(i, j) {
    for (let instrumento of instrumentos) {

        if (instrumento.fila == i && instrumento.columna == j) {
            let estado = "";
            if (instrumento.tipo == 1) {
                if (!instrumento.estado) {
                    estado = "broken";
                    return `<div class="instrument" data-toggle="modal"  data-target=".modal" onclick="showModal(${instrumento.id})">
                                                <i class="fa fa-desktop ${estado}" aria-hidden="true"></i>
                                            </div>`;
                }
                estado = "working";
                return `<div class="instrument" >
                                                <i class="fa fa-desktop ${estado}" aria-hidden="true"></i>
                                            </div>`;

            }
            //  else if (instrumento.tipo == 2) {
            //     if (!instrumento.estado) {
            //         estado = "broken";
            //         $(`.beam`).html(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
            //                                             <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
            //                                         </div>`);
            //     } else {
            //         estado = "working";
            //         $(`.beam`).html(`<div class="instrument">
            //                                             <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
            //                                         </div>`);
            //     }


            // } else if (instrumento.tipo == 3) {
            //     if (!instrumento.estado) {
            //         estado = "broken";
            //         $(`.audio`).html(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
            //                                         <i class="fa fa-music ${estado}" aria-hidden="true"></i>
            //                                     </div>`);
            //     } else {
            //         estado = "working";
            //         $(`.audio`).html(`<div class="instrument" >
            //                                         <i class="fa fa-music ${estado}" aria-hidden="true"></i>
            //                                     </div>`);
            //     }

            // }
        }

    }
    return `<strong>Not Found</strong>`
}
/**
 * Muestra el card correspondiente
 * @param {* indice} i 
 */
function showModal(id_instrumento) {
    $(".modal-title").html(`Cargando...`)
    $(".modal-body").html(`
                        <div style="display:table;margin:auto;font-size:120px" class="loading">
                        </div>`);
    $.ajax({
        url: `${url}/reporte/selectByDispositivo`,
        type: "POST",
        contentType: "applicacion/json",
        processData: false,
        data: JSON.stringify({
            id: id_instrumento
        }),
        success: function (res) {
            let reportes = res;
            let model = {
                title: "",
                body: ""
            }
            let tipo_dispo = reportes[0].dispositivoNombre;
            let estado = reportes[0].estadoNombreDispositivo;
            if (tipo_dispo === "pc") {
                model.title = "PC";
                model.body = `
                <div>
                    <span class="fa fa-desktop broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
                `;
                $(".modal-footer").html(`
                <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cerrar
                </button>`);

                let icon = "";
                let estadoParte = "";
                let fecha = "";
                let denunciante = "";
                let profesor = "";
                let descripcion = "";
                for (let reporte of reportes) {

                    if (reporte.dispositivoParteId === 1) {
                        icon = "fa-hand-pointer-o";
                    } else if (reporte.dispositivoParteId === 2) {
                        icon = "fa-keyboard-o"
                    } else if (reporte.dispositivoParteId === 3) {
                        icon = "fa-television";
                    } else if (reporte.dispositivoParteId === 4) {
                        icon = "fa-building";
                    }
                    estadoParte = reporte.estadoNombreReporte;
                    fecha = reporte.fecha;
                    denunciante = reporte.denuncianteNombre;
                    profesor = reporte.profesorNombre;
                    descripcion = reporte.descripcion;
                    model.body += `
                    <hr>
                    <div>
                        <span class="fa ${icon} size-instrument-4">
                        </span>
                    </div>
                
                
                    <div class="big-first-letter">
                        <label>Estado</label>
                        <span class="label label-danger">${estadoParte}</span>
                    </div>
                
                
                    
                    <div>
                        <label>Fecha</label>
                        <small>${fecha}</small>
                    </div>
                    
                    <div>
                        <label>Denunciante:</label> 
                        <small>${denunciante}</small>
                    </div>
                    
                    
                    <div>
                        <label>Reporte validado por el profesor:</label>
                        <small>${profesor}</small>
                    </div>
                 
                    <div>
                        <label>Descripción</label>
                        <p>
                            ${descripcion}
                        </p>
                    
                    </div>
                    <div>
                        <button type="button" onclick="resolve(${reporte.id})" class="btn btn-outline">Solucionar
                            <i class="fa fa-thumbs-up"></i>
                        </button>
                    </div>
                        `;


                }
            } else if (tipo_dispo === "video beam") {
                model.title = "VideoBeam";
                model.body = ` 
                <div>
                    <span class="fa fa-video-camera broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
            
            
                <div class="big-first-letter">
                    <label>Estado</label>
                    <span class="label label-danger">${reportes[0].estadoNombreReporte}</span>
                </div>
            

                <div>
                    <label>Fecha</label>
                    <small>${reportes[0].fecha}</small>
                </div>
                
                <div>
                    <label>Denunciante</label>
                    <small>${reportes[0].denuncianteNombre}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>
                    <small>${reportes[0].profesorNombre}</small>
                </div>
             
                <div>
                    <label>Descripción</label>
                    <p>
                        ${reportes[0].descripcion}
                    </p>
                
                </div>
                
                `;
                $(".modal-footer").html(`
                            <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cerrar
                            </button>
                            <button type="button" onclick="resolve(${reportes[0].id})" class="btn btn-outline">Solucionar
                                <i class="fa fa-thumbs-up"></i>
                            </button>`);

            } else if (tipo_dispo === "minicomponente") {
                model.title = "Minicomponente";
                model.body = `
                <div>
                    <span class="fa fa-music broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
            
            
                <div class="big-first-letter">
                    <label>Estado</label>
                    <span class="label label-danger">${reportes[0].estadoNombreReporte}</span>
                </div>
            
            
                
                <div>
                    <label>Fecha</label>
                    <small>${reportes[0].fecha}</small>
                </div>
                
                <div>
                    <label>Reporte hecho por el estudiante</label>
                    <small>${reportes[0].denuncianteNombre}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>
                    <small>${reportes[0].profesorNombre}</small>
                </div>
             
                <div>
                    <label>Descripción</label>
                    <p>
                        ${reportes[0].descripcion}
                    </p>
                
                </div>`
                $(".modal-footer").html(`
                            <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cerrar
                            </button>
                            <button type="button" onclick="resolve(${reportes[0].id})" class="btn btn-outline">Solucionar
                                <i class="fa fa-thumbs-up"></i>
                            </button>`);
            }
            $(".modal-title").html(model.title);
            $(".modal-body").html(model.body);
        },
        error: function (err) {

        }
    })


}

function resolve(id_reporte) {


    $.ajax({
        url: `${url}/reporte/solucionado`,
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({
            id: id_reporte
        }),
        success: function (res) {
            $('.modal').modal('toggle');
            $(".content-header").html(`<div class="alert alert-success alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <h4><i class="icon fa fa-check"></i> Reporte solucionado!</h4>
            El reporte ha sido solucionado con exito.
          </div>
            `);
            ufpsReportMsg();
        },
        error: function (err) {
            $(".content-header").html(`
            <div class="alert alert-error alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <h4><i class="icon fa fa-check"></i> Reporte solucionado!</h4>
            El reporte ha sido solucionado con exito.
          </div>`)
        }
    })
}