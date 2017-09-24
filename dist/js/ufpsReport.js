var reports = [];
var instrumentos = [];
var salas = [];
var onOpen = false;
var url = "http://localhost:3000";
var reportSelected;
var codigo = localStorage.getItem("codigo");
console.log("codigo ", codigo);

if (codigo) {
    ctrlPages($("#pageLogin"), $("#pageReport"));
    loadSalas();
}
/**
 * Funcion asincrona para soclitiar el inicio de sesion
 */
function signIn() {
    console.log("entro");
    let codigo = $("input[name='codigo']").val();
    let contrasena = $("input[name='contrasena']").val();
    if (!codigo || !contrasena) {
        $(".content-header").html(`<div class="alert alert-danger alert-dismissible" style="margin-top:20px;">
                 <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                 <h4><i class="icon fa fa-ban"></i>Datos vacios</h4>
                 Asegurate de digitar todos los datos.
               </div>`);
        resetInputs();
    }
    else {
        $.ajax({
            url: `${url}/usuario/select`,
            type: "GET",
            data: { codigo: codigo, pass: contrasena },
            success: function (success) {
                console.log(success);
                if (success.msgTitle) {
                    $(".content-header").html(`<div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i>Datos incorrectos</h4>
                    El codigo o la contraseña son incorrectos.
                  </div>`);
                }
                else if (success[0].nombre) {
                    for (let item in success[0]) {
                        localStorage.setItem(item, success[0][item]);
                    }
                    $("#tipo").html(localStorage.getItem("tipoRol")).addClass("big-first-letter");

                    loadSalas();
                    ctrlPages($("#pageLogin"), $("#pageReport"));
                } else {
                    $(".content-header").html(`<div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i>Algo ha ido mal</h4>
                    Intentalo de nuevo mas tarde.
                  </div>`);
                }

            },
            error: function (err) {
                console.log("ERR,", err);

            }
        })

    }

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

function loadSalas() {
    $.ajax({
        url: `${url}/salon/selectAll`,
        type: "GET",
        success: function (res) {
            if (res) {
                let salasFormat = [];
                salas = res;
                console.log(salas);
                for (let sala of salas) {
                    salasFormat.push(`<li><a href="#" id="${sala.id}" onclick="loadInstrumentos(${sala.id})">
                        <i class="fa fa-circle"></i>
                        ${sala.edificio} - ${sala.nombre}
                    </a></li>`);
                }
                $(".treeview-menu").html(salasFormat.join(""));

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

/**
 * Devuelve la cantidad de columnas por bloque de un salon
 * @param {*} id_sala 
 */
function getTipoSalon(id_sala) {
    for (let item of salas) {
        if (item.id === id_sala) {
            return item.mesa;
        }
    }
    return null;
}

function loadInstrumentos(idSala) {
    $.ajax({
        url: `${url}/dispositivo/selectBySalon`,
        type: "GET",
        data: { "id": idSala },
        success: function (res) {
            instrumentos = res[0].instrumentos;
            let pcs = [];
            let videobeam = "";
            let mini = "";
            let tipo_salon = getTipoSalon(idSala);
            if (tipo_salon === "3") {
                tipo_salon = "size-instrument-3";
            } else if (tipo_salon === "4") {
                tipo_salon = "size-instrument-4";
            }
            for (let instrumento of instrumentos) {

                let estado = "";
                if (instrumento.tipoNombre === "pc") {
                    if (instrumento.estadoNombre === "dañado") {
                        estado = "broken";
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                    }
                    pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                    <i class="fa fa-desktop ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`);


                }
                else if (instrumento.tipoNombre === "video beam") {
                    if (instrumento.estadoNombre === "dañado") {
                        estado = "broken";
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                    }
                    videobeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                    <i class="fa fa-video-camera ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`;

                }
                else if (instrumento.tipoNombre === "minicomponente") {
                    if (instrumento.estadoNombre === "dañado") {
                        estado = "broken";
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                    }
                    mini = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                    <i class="fa fa-music ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`;
                }
            }
            let pcsRight = pcs.slice(Math.ceil(pcs.length / 2));
            let pcsLeft = pcs.slice(0, Math.ceil(pcs.length / 2));
            $(".section-instrument .section-pcs-left").html(pcsLeft.join(""));
            $(".section-instrument .section-pcs-right").html(pcsRight.join(""));
            $(".section-instrument .section-audio").html(mini);
            $(".section-instrument .section-videobeam").html(videobeam);
        },
        error: function (err) {

        }
    })
}
/**
 * Cargamos los instrumentos
 */
// function loadInstrumentos(idSala) {
//     $.ajax({
//         url: `${url}/servicios_arch/reporte/selectAll`,
//         type: "GET",
//         data: { id_sala: idSala },
//         success: function (res) {
//             if (res.success) {
//                 instrumentos = res.success;
//                 let pcs = [];
//                 for (let instrumento of instrumentos) {
//                     if (instrumento.tipo_instrumento === "PC") {
//                         let indiceReporte = hasReport(instrumento.id);
//                         let reporte;
//                         if (indiceReporte !== -1) {
//                             reporte = reports[indiceReporte];
//                             if (reporte.estado === "dañado") {
//                                 pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                                      <i class="fa fa-desktop broken size-instrument" aria-hidden="true"></i>
//                                    </div>
//                                    `)
//                             } else if (reporte.estado === "reparacion") {
//                                 pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                                  <i class="fa fa-desktop reparation size-instrument" aria-hidden="true"></i>
//                                </div>
//                                `)
//                             }
//                         } else {
//                             pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" >
//                             <i class="fa fa-desktop reparation size-instrument" aria-hidden="true"></i>
//                           </div>`)
//                         }


//                     }
//                     else if (report.tipo_instrumento === "videobeam") {
//                         if (report.estado === "dañado") {
//                             videoBeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-video-camera broken size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         } else if (report.estado === "reparacion") {
//                             videoBeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-video-camera reparation size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         }

//                     }
//                     else if (report.tipo_instrumento === "minicomponente") {
//                         if (report.estado === "dañado") {
//                             audio = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-music broken size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         } else if (report.estado === "reparacion") {
//                             audio = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-music reparation size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         }

//                     }
//                     i += 1;
//                 }
//             }
//             else if (res.error) {
//                 console.log(res.error);
//             }
//         },
//         error: function (err) {
//             console.log(res.error);
//         }
//     });
// }
/**
 * Carga todos los reportes
 */
// function loadReports(idSala) {


//     $.ajax({
//         url: `${url}/servicios_arch/reporte/selectAll`,
//         type: "GET",
//         data: { id_sala: idSala },
//         success: function (res) {
//             if (res, success) {
//                 console.log(res);
//                 reports = res.success;
//                 let pcs = [];
//                 let videoBeam = "";
//                 let audio = "";
//                 let i = 0;
//                 for (let report of reports) {
//                     if (report.tipo_instrumento === "PC") {
//                         if (report.estado === "dañado") {
//                             pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                                  <i class="fa fa-desktop broken size-instrument" aria-hidden="true"></i>
//                                </div>
//                                `)
//                         } else if (report.estado === "reparacion") {
//                             pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                              <i class="fa fa-desktop reparation size-instrument" aria-hidden="true"></i>
//                            </div>
//                            `)
//                         }

//                     }
//                     else if (report.tipo_instrumento === "videobeam") {
//                         if (report.estado === "dañado") {
//                             videoBeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-video-camera broken size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         } else if (report.estado === "reparacion") {
//                             videoBeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-video-camera reparation size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         }

//                     }
//                     else if (report.tipo_instrumento === "minicomponente") {
//                         if (report.estado === "dañado") {
//                             audio = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-music broken size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         } else if (report.estado === "reparacion") {
//                             audio = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
//                             <i class="fa fa-music reparation size-instrument" aria-hidden="true"></i>
//                           </div>`;
//                         }

//                     }
//                     i += 1;
//                 }
//                 let pcsRight = pcs.slice(Math.ceil(pcs.length / 2));
//                 let pcsLeft = pcs.slice(0, Math.ceil(pcs.length / 2));
//                 $(".section-instrument .section-pcs-left").html(pcsLeft.join(""));
//                 $(".section-instrument .section-pcs-right").html(pcsRight.join(""));
//                 $(".section-instrument .section-audio").html(audio);
//                 $(".section-instrument .section-videobeam").html(videoBeam);
//             }
//         },
//         error: function (err) {
//             console.log("ERORRORR");
//             console.log(err);

//         }
//     })


// }

/**
 * Muestra el card correspondiente
 * @param {* indice} i 
 */
function showModal(id_instrumento) {
    $(".moda-title").html(`Cargando...`)
    $(".modal-body").html(`<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
                                <span class="sr-only">20% Complete</span>
                            </div>`);
    $.ajax({
        url: `${url}/reporte/selectByDispositivo`,
        type: "GET",
        data: { id: id_instrumento },
        success: function (res) {
            let reportes = res;
            let model = {
                title: "",
                body: ""
            }
            let tipo_dispo = reportes[0].dispositivoNombre;
            let estado = reportes[0].estadoNombreDispositivo === "dañado" ? ` <span class="label label-danger big-first-letter">${estado}</span>` : ` <span class="label label-warning big-first-letter">${estado}</span>`;
            if (tipo_dispo === "pc") {
                moda.title = "PC";
                model.body = `
                <div>
                    <span class="fa fa-desktop broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
                `;
                let icon = "";
                let estadoParte = "";
                let fecha = "";
                let denunciante = "";
                let profesor = "";
                let descripcion = "";
                for (let reporte in reportes) {

                    if (reporte.dispositivoParteId === 1) {
                        icon = "fa-hand-pointer-o";

                    }
                    else if (reporte.dispositivoParteId === 2) {
                        icon = "fa-keyboard-o"
                    }
                    else if (reporte.dispositivoParteId === 3) {
                        icon = "fa-television";
                    }
                    else if (reporte.dispositivoParteId === 4) {
                        icon = "fa-building";
                    }
                    estadoParte = reporte.estadoNombreReporte;
                    fecha = reporte.fecha;
                    denunciante = reporte.denuncianteNombre;
                    profesor = reporte.profesorNombre;
                    descripcion = reporte.descripcion;
                    modal.body = +`
                    <hr>
                    <div>
                        <span class="fa ${icon} size-instrument-4">
                        </span>
                    </div>
                
                
                    <div class="big-first-letter">
                        <label>Estado</label>$nbsp;$nbsp;
                        ${estadoParte}
                    </div>
                
                
                    
                    <div>
                        <label>Fecha</label>$nbsp;$nbsp;
                        <small>${fecha}</small>
                    </div>
                    
                    <div>
                        <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
                        <small>${denunciante}</small>
                    </div>
                    
                    
                    <div>
                        <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
                        <small>${profesor}</small>
                    </div>
                 
                    <div>
                        <label>Descripción</label>
                        <p>
                            ${descripcion}
                        </p>
                    
                    </div>
                        `
                }
            }
            else if (tipo_dispo === "video beam") {
                modal.title = "VideoBeam";
                modal.body = ` 
                <hr>
                <div>
                    <span class="fa fa-video-camera broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
            
            
                <div class="big-first-letter">
                    <label>Estado</label>$nbsp;$nbsp;
                    ${reporte.estadoNombreReporte}
                </div>
            
            
                
                <div>
                    <label>Fecha</label>$nbsp;$nbsp;
                    <small>${reporte.fecha}</small>
                </div>
                
                <div>
                    <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
                    <small>${reporte.denuncianteNombre}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
                    <small>${reporte.profesorNombre}</small>
                </div>
             
                <div>
                    <label>Descripción</label>
                    <p>
                        ${reporte.descripcion}
                    </p>
                
                </div>`
            }
            else if (tipo_dispo === "minicomponente") {
                modal.title = "Minicomponente";
                modal.body = `
                <hr>
                <div>
                    <span class="fa fa-music broken bigger-instrument" style="
                        font-size: 5em !important;
                        display: table !important;
                        margin: auto;">
                    </span>
                </div>
            
            
                <div class="big-first-letter">
                    <label>Estado</label>$nbsp;$nbsp;
                    ${reporte.estadoNombreReporte}
                </div>
            
            
                
                <div>
                    <label>Fecha</label>$nbsp;$nbsp;
                    <small>${reporte.fecha}</small>
                </div>
                
                <div>
                    <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
                    <small>${reporte.denuncianteNombre}</small>
                </div>
                
                
                <div>
                    <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
                    <small>${reporte.profesorNombre}</small>
                </div>
             
                <div>
                    <label>Descripción</label>
                    <p>
                        ${reporte.descripcion}
                    </p>
                
                </div>`
            }
        },
        error: function (err) {

        }
    })

    // if (instrument.tipo_instrumento === "pc") {
    //     model.title = "PC";
    //     let elementos = [];
    //     elementos.push(instrument.mouse ? `<span class="label label-success">Mouse</span>` : `<span class="label label-danger">Mouse</span>`)
    //     elementos.push(instrument.pantalla ? `<span class="label label-success">Pantalla</span>` : `<span class="label label-danger">Pantalla</span>`)
    //     elementos.push(instrument.cpu ? `<span class="label label-success">CPU</span>` : `<span class="label label-danger">CPU</span>`)
    //     elementos.push(instrument.teclado ? `<span class="label label-success">Teclado</span>` : `<span class="label label-danger">Teclado</span>`)



    //     model.body = `
    //         <div>
    //                 <span class="fa fa-desktop bigger-instrument" style="
    //             font-size: 5em !important;
    //             display: table !important;
    //             margin: auto;
    //             "></span>
    //         </div>


    //         <div>
    //             <label>Estado</label>$nbsp;$nbsp;
    //             ${estado}
    //         </div>



    //         <div>
    //             <label>Fecha</label>$nbsp;$nbsp;
    //             <small>${instrument.fecha}</small>
    //         </div>

    //         <div>
    //             <label>Estado de los elementos</label>$nbsp;$nbsp;
    //             ${elementos.join("")}
    //         </div>

    //         <div>
    //             <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
    //             <small>${instrument.estudiante.nombre}</small>
    //         </div>


    //         <div>
    //             <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
    //             <small>${instrument.profesor.nombre}</small>
    //         </div>




    //         <div>
    //         <label>Descripción</label>
    //         <p>
    //             ${instrument.descripcion}
    //         </p>

    //         </div>


    //             `
    // }
    // else if (instrument.tipoDescripcion === "Videobeam") {
    //     model.title = "VideoBeam";
    //     model.body = `
    //             <div>
    //                     <span class="fa fa-video-camera bigger-instrument" style="
    //                 font-size: 5em !important;
    //                 display: table !important;
    //                 margin: auto;
    //                 "></span>
    //             </div>


    //             <div>
    //                 <label>Estado</label>$nbsp;$nbsp;
    //                 ${estado}
    //             </div>



    //             <div>
    //                 <label>Fecha</label>$nbsp;$nbsp;
    //                 <small>${instrument.fecha}</small>
    //             </div>

    //             <div>
    //                 <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
    //                 <small>${instrument.estudiante.nombre}</small>
    //             </div>


    //             <div>
    //                 <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
    //                 <small>${instrument.profesor.nombre}</small>
    //             </div>




    //             <div>
    //                 <label>Descripción</label>
    //                 <p>
    //                 ${instrument.descripcion}
    //                 </p>

    //             </div>
    //     `
    // }
    // else if (instrument.tipoDescripcion === "Minicomponente") {
    //     model.title = "MiniComponente";
    //     model.body = `
    //         <div>
    //             <span class="fa fa-music bigger-instrument" style="
    //             font-size: 5em !important;
    //             display: table !important;
    //             margin: auto;
    //             "></span>
    //         </div>


    //         <div>
    //             <label>Estado</label>$nbsp;$nbsp;
    //             ${estado}
    //         </div>



    //         <div>
    //             <label>Fecha</label>$nbsp;$nbsp;
    //             <small>${instrument.fecha}</small>
    //         </div>

    //         <div>
    //             <label>Reporte hecho por el estudiante</label>$nbsp;$nbsp;
    //             <small>${instrument.estudiante.nombre}</small>
    //         </div>


    //         <div>
    //             <label>Reporte validado por el profesor</label>$nbsp;$nbsp;
    //             <small>${instrument.profesor.nombre}</small>
    //         </div>




    //         <div>
    //             <label>Descripción</label>
    //             <p>
    //             ${instrument.descripcion}
    //             </p>

    //         </div>
    //     `
    // }


    $(".modal-footer").html(`
        <button type="button" class="btn btn-outline pull-left" data-dismiss="modal">Cerrar
        </button>
        <button type="button" onclick="resolve(${reporte.id})" class="btn btn-outline">Reparado
            <i class="fa fa-thumbs-up"></i>
        </button>`);

    $(".modal-title").html(model.title);
    $(".modal-body").html(model.body);
}

function resolve(id_reporte, estado) {
    

    $.ajax({
        url: `${url}/reporte/solucionado`,
        type: "GET",
        data:{},
        success: function (res) {
            
            $(".msg").html(`<div class="alert alert-success alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <h4><i class="icon fa fa-check"></i> Reporte solucionado!</h4>
            El reporte ha sido solucionado con exito.
          </div>
            `)

        },
        error: function (err) {
            $(".msg").html(`
            <div class="alert alert-error alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <h4><i class="icon fa fa-check"></i> Reporte solucionado!</h4>
            El reporte ha sido solucionado con exito.
          </div>`)
        }
    })
}
