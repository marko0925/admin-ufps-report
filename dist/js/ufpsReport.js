var reports = [];
var onOpen = false;
var reportSelected;
var codigo = localStorage.getItem("codigo");
console.log("codigo ", codigo);
if (codigo) {
    ctrlPages($("#pageLogin"), $("#pageReport"));
    loadReports();
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
        localStorage.setItem("codigo", codigo);
        localStorage.setItem("pass", contrasena);
        loadReports(codigo, contrasena);
    }
    // $.ajax({
    //     url: '',
    //     method: "POST",
    //     data: { codigo: codigo, contrasena: contrasena },
    //     success: function (success) {
    //         console.log("OK!", success);
    //     },
    //     error: function (err) {
    //         console.log("ERR,", err);
    //         $("#msg").html(`<div class="alert alert-danger alert-dismissible">
    //         <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
    //         <h4><i class="icon fa fa-ban"></i>Datos incorrectos</h4>
    //         El codigo o la contraseña son incorrectos.
    //       </div>`);
    //     }
    // })
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

/**
 * Carga todos los reportes
 */
function loadReports(codigo, pass) {

    // $.ajax({
    //     url: `http://gidis.ufps.edu.co:8088/servicios_arch/sala/selectAll`,
    //     type: "POST",
    //     success: function (res) {
    //         if (res) {
    //             console.log(res);
    //             // ctrlPages($("#pageLogin"), $("#pageReport"));
    //         }
    //     },
    //     error: function (err) {
    //         console.log("ERORRORR")
    //         console.log(err);

    //     }
    // });
    $.ajax({
        url: `http://gidis.ufps.edu.co:8088/servicios_arch/reporte/selectAll`,
        type: "GET",
        contentType: 'html',
        success: function (res) {
            if (res) {
                console.log(res);
                reports = res;
                ctrlPages($("#pageLogin"), $("#pageReport"))
                let pcs = [];
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                })
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 15:30:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 21, 2017 14:20:00 pM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "noValidado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "pc"
                });
                reports.push({
                    "id_reporte": 2,
                    "clase": 23,
                    "estado": "validado",
                    "fecha": "Sep 20, 2017 12:00:00 AM",
                    "instrumento": "123",
                    "instrumentoNombre": "pc gomelito",
                    "tipoDescripcion": "Videobeam"
                });
                let videoBeam = "";
                let audio = "";
                let i = 0;
                console.log(reports);
                for (let report of reports) {
                    if (report.tipoDescripcion === "pc") {
                        if (report.keyboard === false || report.mouse === false ||
                            report.cpu === false || report.screen === false) {
                            pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
                                 <i class="fa fa-desktop broken size-instrument" aria-hidden="true"></i>
                               </div>
                               `)
                        } else {
                            pcs.push(`<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
                             <i class="fa fa-desktop size-instrument" aria-hidden="true"></i>
                           </div>
                           `)
                        }

                    }
                    else if (report.tipoDescripcion === "Videobeam") {
                        videoBeam = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
                         <i class="fa fa-video-camera size-instrument" aria-hidden="true"></i>
                       </div>`;
                    }
                    else if (report.tipoDescripcion === "Minicomponente") {
                        audio = `<div class="instrument" data-toggle="modal" data-target=".modal" onclick="showModal(${i})">
                         <i class="fa fa-music size-instrument" aria-hidden="true"></i>
                       </div>`;
                    }
                    i += 1;
                }
                console.log(audio);
                console.log(videoBeam)

                let pcsRight = pcs.slice(Math.ceil(pcs.length / 2));
                let pcsLeft = pcs.slice(0, Math.ceil(pcs.length / 2));
                $(".section-instrument .section-pcs-left").html(pcsLeft.join(""));
                $(".section-instrument .section-pcs-right").html(pcsRight.join(""));
                $(".section-instrument .section-audio").html(audio);
                $(".section-instrument .section-videobeam").html(videoBeam);
            }
        },
        error: function (err) {
            console.log("ERORRORR");
            console.log(err);

        }
    })


}

/**
 * Muestra el card correspondiente
 * @param {* indice} i 
 */
function showModal(i) {

    reportSelected = i;
    let model = {
        title: null,
        body: null
    }
    let instrument = reports[i];
    if (instrument.tipoDescripcion === "pc") {
        model.title = "PC";
        model.body = `
        <span class="fa fa-desktop bigger-instrument"></span>
        <label>Descripción</label>
        <p>
            ${reports[i].tipoDescripcion}
        </p>
        `
    }
    else if (instrument.tipoDescripcion === "Videobeam") {
        model.title = "VideoBeam";
        model.body = `
        <span class="fa fa-video-camera bigger-instrument"></span>
        <label>Descripción</label>
        <p>
            ${reports[i].tipoDescripcion}
        </p>
        `
    }
    else if (instrument.tipoDescripcion === "Minicomponente") {
        model.title = "MiniComponente";
        model.body = `
        <span class="fa fa-music bigger-instrument"></span>
        <label>Fecha </label>
        <small>${instrument.fecha}</small>
        <label style="display:block;">Descripción</label>
        <p>
            ${instrument.instrumentoNombre}
            ${reports[i].tipoDescripcion}
        </p>
        `
    }



    $(".modal-title").html(model.title);
    $(".modal-body").html(model.body);
}

function resolve() {
    let report = reports[reportSelected];
    report.estado = "Solucionado";
    $.ajax({
        url: `http://gidis.ufps.edu.co:8088/servicios_arch/reporte/updateEstado?id_reporte=${report.id_reporte}&estado=Solucionado`,
        type: "GET",
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
