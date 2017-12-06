var reports = [];
var instrumentos = [];
var salas = [];
var onOpen = false; // se quita
var url = "http://35.227.122.71/servicioApp/index.php";
var reportSelected; //se quita
var correo = localStorage.getItem("correo");

$(".logo").attr("href", "/")
if (correo) {
    $("#tipo").html(localStorage.getItem("nombre")).addClass("big-first-letter");
    ctrlPages($("#pageLogin"), $("#pageReport"));
    loadEdificios();
} else {
    $("#pageLogin").removeClass("hide-section");
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
        swal(
            'Oops...',
            'Asegurate de digitar todos los datos.',
            'error'
          )
        // $("#msg").html(`<div class="alert alert-danger alert-dismissible" style="margin-top:20px;">
        //          <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        //          <h4><i class="icon fa fa-ban"></i>Datos vacios</h4>
        //          Asegurate de digitar todos los datos.
        //        </div>`);
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
                console.log(res);
                if (res.err) {
                    swal(
                        'Oops...',
                        'Verifica que tus datos esten correctos.',
                        'error'
                      )
                //     $("#msg").html(`<div class="alert alert-danger alert-dismissible">
                //     <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                //     <h4><i class="icon fa fa-ban"></i>Algo ha ido mal</h4>
                //     Verifica que tus datos esten correctos.
                //   </div>`);
                } else {
                    $("#msg").html("");
                    for (let item in res[0]) {
                        localStorage.setItem(item, res[0][item]);
                    }
                    $("#tipo").html(localStorage.getItem("tipo")).addClass("big-first-letter");

                    loadEdificios();
                    ctrlPages($("#pageLogin"), $("#pageReport"));
                }
                return false;
            },
            error: function (err) {
                swal(
                    'Oops...',
                    'Verifica que tus datos esten correctos.',
                    'error'
                  )
            //     $("#msg").html(`<div class="alert alert-danger alert-dismissible">
            //     <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            //     <h4><i class="icon fa fa-ban"></i>Algo ha ido mal</h4>
            //     Verifica que tus datos esten correctos.
            //   </div>`);
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
 * Function encargada de vaciar el header **cristian**
 */
function vaciar_header() {
    $(".content-header").html(``);
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
    $(".section-dispositivos").html(`
        <div class="ufps-report text-center">    
        <span><b>Mux</b>Bird</span>     
        <div class="row" style="height:1px"></div>
        <img src="dist/img/logo.png" width="300px" >
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
        type: "GET",
        contentType: "application/json",
        success: function (res) {
            if (res) {
                salas = res.sussess;

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
    $(".section-dispositivos").html(``);
    $(".section-dispositivos").html(`
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
    $(".seccioninfo").hide();
    $("#consultar-reportefallo").show();
    $("#titulosectiondispotivos").html("Dispositivos")

    $(".content-header").html(`
        <h1>
            Dispositivos
            <small>Dispositivos de la sala <strong id="sala" class="upper">${get_nombre_sala(idSala)}</strong></small>
        </h1>`)
    loading();
    $.ajax({
        url: `${url}/dispositivo/listar`,
        type: "GET",
        contentType: "application/json",
        data: {
            "sala": idSala
        },
        success: function (res) {

            instrumentos = res.sussess;
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
                        <div class="col-lg-${12 / (columnas / 2)} col-md-${12 / (columnas / 2)} col-sm-${12 / (columnas / 2)} col-xs-${12 / (columnas / 2)} ${i}-${j}">
                        ${loadDispositivoIndividual(i, j)}
                        </div>
                    `);
                    } else {
                        devicesLeftArray.push(`
                        <div class="col-lg-${12 / (columnas / 2)} col-md-${12 / (columnas / 2)} col-sm-${12 / (columnas / 2)} col-xs-${12 / (columnas / 2)} ${i}-${j}">
                        ${loadDispositivoIndividual(i, j)}
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

        },
        error: function (err) {

        }
    })
}

function loadOtrosDevices() {
    for (let instrumento of instrumentos) {
        if (instrumento.fila == -2 && instrumento.columna == -2) {

            if (instrumento.tipo == 2) {
                if (!instrumento.estado) {
                    estado = "broken";
                    $(`.beam`).html(`<span data-toggle="tooltip" title="" class="fa fa-info-circle" data-original-title="Ref:${instrumento.referencia} Reportes: ${instrumento.numero_reportes}"></span>
                    <div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id},${instrumento.tipo})">
                                                            <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                } else {
                    estado = "working";
                    $(`.beam`).html(`<span data-toggle="tooltip" title="" class="fa fa-info-circle" data-original-title="Ref:${instrumento.referencia}"></span>
                    <div class="instrument">
                    <i class="fa fa-video-camera ${estado}" aria-hidden="true"></i>
                    </div>`);
                }
            }
        } else if (instrumento.fila == -1 && instrumento.columna == -1) {
            if (instrumento.tipo == 3) {
                if (!instrumento.estado) {
                    estado = "broken";
                    $(`.audio`).html(`<span data-toggle="tooltip" title="" class=" hidden-sm hidden-xs fa fa-info-circle" data-original-title="Ref:${instrumento.referencia} Reportes: ${instrumento.numero_reportes}"></span>
                    <div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id},${instrumento.tipo})">
                                                            <i class="fa fa-music ${estado}" aria-hidden="true"></i>
                                                        </div>`);
                } else {
                    estado = "working";
                    $(`.audio`).html(`<span data-toggle="tooltip" title="" class="hidden-sm hidden-xs fa fa-info-circle" data-original-title="Ref:${instrumento.referencia}"></span>
                    <div class="instrument" >
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

                    return `
                    <span data-toggle="tooltip" title="" class="hidden-sm hidden-xs fa fa-info-circle" data-original-title="Ref: ${instrumento.referencia} - Reportes: ${instrumento.numero_reportes}"></span>
                    <div class="instrument" data-toggle="modal"  data-target=".modal" onclick="showModal(${instrumento.id},${instrumento.tipo})">
                                                <i class="fa fa-desktop ${estado}" aria-hidden="true"></i>
                                            </div>`;
                }
                estado = "working";
                return `<span data-toggle="tooltip" title="" class=" hidden-sm hidden-xs fa fa-info-circle" data-original-title="Ref: ${instrumento.referencia}"></span>
                <div class="instrument" >
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
    return `<div class="">
        <span data-toggle="tooltip" title="" class="instrument fa fa-question-circle" data-original-title="No existe"></span>
        </div>`;
}
/**
 * Muestra el card correspondiente
 * @param {* indice} i 
 */
function showModal(id_instrumento, tipo) {
    $(".modal-title").html(`Cargando...`)
    $(".modal-body").html(`
                        <div style="display:table;margin:auto;font-size:120px" class="loading">
                        </div>`);
    $.ajax({
        url: `${url}/reporte/visualizar`,
        type: "GET",
        contentType: "applicacion/json",
        data: {
            id: id_instrumento
        },
        success: function (res) {
            let reportes = res.success;
            let model = {
                title: "",
                body: ""
            }
            let estado = reportes[0].estado;
            if (tipo === 1) {
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
                let fecha = null;
                let denunciante = "";
                let profesor = "";
                let descripcion = "";
                for (let reporte of reportes) {

                    if (reporte.perisferico === "mouse") {
                        icon = "fa-hand-pointer-o";
                    } else if (reporte.perisferico === "teclado") {
                        icon = "fa-keyboard-o"
                    } else if (reporte.perisferico === "pantalla") {
                        icon = "fa-television";
                    } else if (reporte.perisferico === "cpu") {
                        icon = "fa-building";
                    }
                    estadoParte = "Dañado";
                    fecha = new Date(reporte.fecha);
                    denunciante = reporte.nombre_autor;
                    profesor = reporte.nombre_docente;
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
                        <small>${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}</small>
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
            } else if (tipo === 2) {
                let fecha = new Date(reportes[0].fecha);
                let estado = "Dañado";
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
                    <span class="label label-danger">${estado}</span>
                </div>
            

                <div>
                    <label>Fecha</label>
                    <small>${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}</small>
                </div>
                
                <div>
                    <label>Denunciante</label>
                    <small>${reportes[0].nombre_autor}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>
                    <small>${reportes[0].nombre_docente}</small>
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

            } else if (tipo === 3) {
                let fecha = new Date(reportes[0].fecha);
                let estado = "Dañado";
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
                    <span class="label label-danger">${estado}</span>
                </div>
            
            
                
                <div>
                    <label>Fecha</label>
                    <small>${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}</small>
                </div>
                
                <div>
                    <label>Reporte hecho por el estudiante</label>
                    <small>${reportes[0].nombre_autor}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>
                    <small>${reportes[0].nombre_docente}</small>
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
        url: `${url}/reporte/reparar`,
        type: "GET",
        contentType: "application/json",
        data: {
            id: id_reporte,
            descripcion: "Se mando a reparar",
            autor: localStorage.getItem("id")
        },
        success: function (res) {
            $('.modal').modal('toggle');
            swal(
                'Solicitud enviada!',
                'El reporte ha sido mandado a reparar..',
                'success'
              )
        //     $(".content-header").html(`<div class="alert alert-success alert-dismissible">
        //     <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        //     <h4><i class="icon fa fa-check"></i> Solicitud enviada!</h4>
        //     El reporte ha sido mandado a reparar.
        //   </div>
        //     `);
            ufpsReportMsg();
        },
        error: function (err) {
            $('.modal').modal('toggle');
            swal(
                'Oops...',
                'Algo inesperado acaba de suceder, intentalo mas tarde.',
                'error'
              )
        //     $(".content-header").html(`
        //     <div class="alert alert-error alert-dismissible">
        //     <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        //     <h4><i class="icon fa fa-check"></i> ¡Ups! algo ha ido mal.</h4>
        //     Algo inesperado acaba de suceder, intentalo mas tarde.
        //   </div>`)
        }
    })
}


$('.modal').on('hide.bs.modal', function (e) {
    //     $('.modal').modal('toggle');   
    $(".modal-backdrop").hide();
})