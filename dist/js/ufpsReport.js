var reports = [];
var instrumentos = [];
var salas = [];
var onOpen = false;
var url = "http://gidis.ufps.edu.co:8088/servicios_arch";
var reportSelected;
var codigo = localStorage.getItem("codigo");
console.log("codigo ", codigo);
$(".logo").attr("href", "/")
if (codigo) {
    $("#tipo").html(localStorage.getItem("tipoRol")).addClass("big-first-letter");
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
        $("#msg").html(`<div class="alert alert-danger alert-dismissible" style="margin-top:20px;">
                 <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                 <h4><i class="icon fa fa-ban"></i>Datos vacios</h4>
                 Asegurate de digitar todos los datos.
               </div>`);
        resetInputs();
    }
    else {
        console.log(codigo, contrasena);
        $.ajax({
            url: `${url}/usuario/select`,
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify({ codigo: codigo, pass: contrasena }),
            success: function (success) {
                console.log(success);
                if (success.msgTitle) {
                    $("#msg").html(`<div class="alert alert-danger alert-dismissible" style="margin-top:40px;">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i>Datos incorrectos</h4>
                    El codigo o la contraseña son incorrectos.
                  </div>`);
                }
                else if (success.nombre) {
                    $("#msg").html("");
                    for (let item in success) {
                        localStorage.setItem(item, success[item]);
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

function salir(){
    localStorage.clear();
    ctrlPages($("#pageReport"),$("#pageLogin"));
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
    loading();
    $.ajax({
        url: `${url}/salon/selectAll`,
        type: "POST",
        contentType: "application/json",
        success: function (res) {
            $(".section-instrument").html(`
            <div class="ufps-report">
            <span><b>UFPS</b> REPORT</span>
            </div>
        `);
            if (res) {
                let salasFormat = [];
                salas = res;
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

function loading() {
    $(".section-instrument").html(``);
    $(".section-instrument").html(`
        <div class="loading">
            
        </div>
    `)
}

function get_nombre_sala(id) {
    for (let item of salas) {
        if (item.id === id) {
            return `${item.edificio}-${item.nombre}`;
        }
    }
}

function loadInstrumentos(idSala) {
    $(".content-header").html(`
        <h1>
            Instrumentos
            <small>Instrumentos de la sala <strong id="sala" class="upper">${get_nombre_sala(idSala)}</strong></small>
        </h1>`)
    loading();
    $.ajax({
        url: `${url}/dispositivo/selectBySalon`,
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({ "id": idSala }),
        success: function (res) {
            $(".section-instrument").html(`
           <div class="section-pcs-left">
           
                     </div>
                     <div class="section-videobeam">
           
                     </div>
                     <div class="section-audio">
           
                     </div>
                     <div class="section-pcs-right">
           
                     </div>
           `)

            instrumentos = res;
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
                        pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                    <i class="fa fa-desktop ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`);
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                        pcs.push(`<div class="instrument" >
                                    <i class="fa fa-desktop ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`);
                    }



                }
                else if (instrumento.tipoNombre === "video beam") {
                    if (instrumento.estadoNombre === "dañado") {
                        estado = "broken";
                        videobeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                        <i class="fa fa-video-camera ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                    </div>`;
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                        videobeam = `<div class="instrument">
                                        <i class="fa fa-video-camera ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                    </div>`;
                    }


                }
                else if (instrumento.tipoNombre === "minicomponente") {
                    if (instrumento.estadoNombre === "dañado") {
                        estado = "broken";
                        mini = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${instrumento.id})">
                                    <i class="fa fa-music ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`;
                    }
                    // else if (instrumento.estadoNombre === "reparacion") {
                    //     estado = "reparation";
                    // }
                    else if (instrumento.estadoNombre === "correcto") {
                        estado = "working";
                        mini = `<div class="instrument" >
                                    <i class="fa fa-music ${estado} ${tipo_salon}" aria-hidden="true"></i>
                                </div>`;
                    }

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
        data: JSON.stringify({ id: id_instrumento }),
        success: function (res) {
            let reportes = res;
            let model = {
                title: "",
                body: ""
            }
            console.log(reportes);
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
                    console.log(reporte);

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
                    console.log(model.body);


                }
            }
            else if (tipo_dispo === "video beam") {
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

            }
            else if (tipo_dispo === "minicomponente") {
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
        data: JSON.stringify({ id: id_reporte }),
        success: function (res) {
            $('.modal').modal('toggle');
            $(".content-header").html(`<div class="alert alert-success alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <h4><i class="icon fa fa-check"></i> Reporte solucionado!</h4>
            El reporte ha sido solucionado con exito.
          </div>
            `)

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
