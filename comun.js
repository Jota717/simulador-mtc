/* =========================================================
   COMUN.JS
   Referencias y funciones compartidas entre pantallas
========================================================= */


/* =========================================================
   REFERENCIAS COMUNES DEL DOM
========================================================= */

const pantallaInicio =
    document.getElementById("pantallaInicio");

const pantallaExamen =
    document.getElementById("pantallaExamen");

const pantallaResultado =
    document.getElementById("pantallaResultado");

const pantallaRevision =
    document.getElementById("pantallaRevision");

const opcionesEstudio =
    document.getElementById("opcionesEstudio");

const cantidadPersonalizada =
    document.getElementById("cantidadPersonalizada");


const pantallas = [
    pantallaInicio,
    pantallaExamen,
    pantallaResultado,
    pantallaRevision
];


/* =========================================================
   MOSTRAR PANTALLA
========================================================= */

function mostrarPantalla(pantallaMostrar) {

    if (!pantallas.includes(pantallaMostrar)) {

        console.error(
            "La pantalla indicada no pertenece al simulador."
        );

        return;
    }


    pantallas.forEach(
        pantalla => {
            pantalla.hidden = pantalla !== pantallaMostrar;
        }
    );
}

/* =========================================================
   VOLVER AL INICIO
========================================================= */

function volverAlInicio() {

    mostrarPantalla(pantallaInicio);

    /* Restablecer modo */

    document.querySelector(
        'input[name="modo"][value="estudio"]'
    ).checked = true;


    /* Restablecer cantidad */

    document.querySelector(
        'input[name="cantidad"][value="40"]'
    ).checked = true;


    /* Limpiar y deshabilitar personalizado */

    cantidadPersonalizada.value = "";
    cantidadPersonalizada.disabled = true;


    /* Mostrar nuevamente las opciones de estudio */

    opcionesEstudio.hidden = false;
}



/* =========================================================
   OBTENER RUTA DE IMAGEN
========================================================= */

function obtenerRutaImagen(
    nombreImagen
) {

    if (
        nombreImagen === null ||
        nombreImagen === undefined ||
        nombreImagen === ""
    ) {

        return "";
    }


    /*
     Si el JSON ya contiene la carpeta,
     no la duplicamos.
    */

    if (
        nombreImagen.startsWith(
            "imagenes/"
        )
    ) {

        return nombreImagen;
    }


    return `imagenes/${nombreImagen}`;
}

/* =========================================================
   CREAR CONTENIDO DE UNA ALTERNATIVA
========================================================= */

function crearContenidoAlternativa(
    opcion,
    indice
) {

    if (
        opcion === null ||
        typeof opcion !== "object"
    ) {
        return null;
    }


    const tieneTexto =
        opcion.texto !== null &&
        opcion.texto !== undefined &&
        opcion.texto !== "";


    const tieneImagen =
        opcion.imagen !== null &&
        opcion.imagen !== undefined &&
        opcion.imagen !== "";


    if (!tieneTexto && !tieneImagen) {
        return null;
    }


    const letras =
        ["A", "B", "C", "D"];


    const contenido =
        document.createDocumentFragment();


    const letra =
        document.createElement("strong");

    letra.textContent =
        `${letras[indice]}. `;

    contenido.appendChild(
        letra
    );


    if (tieneTexto) {

        const texto =
            document.createElement("span");

        texto.textContent =
            opcion.texto;

        contenido.appendChild(
            texto
        );
    }


    if (tieneImagen) {

        const imagen =
            document.createElement("img");

        imagen.src =
            obtenerRutaImagen(
                opcion.imagen
            );

        imagen.alt =
            `Alternativa ${letras[indice]}`;

        contenido.appendChild(
            imagen
        );
    }


    return contenido;
}


/* =========================================================
   MODAL PARA CONFIRMAR SALIDA DEL EXAMEN
========================================================= */

const modalSalida =
    document.getElementById("modalSalida");

const btnCancelarSalida =
    document.getElementById("btnCancelarSalida");

const btnConfirmarSalida =
    document.getElementById("btnConfirmarSalida");


function mostrarModalSalida() {

    modalSalida.hidden = false;

    btnCancelarSalida.focus();
}


function cerrarModalSalida() {

    modalSalida.hidden = true;
}


btnCancelarSalida.addEventListener(
    "click",
    cerrarModalSalida
);


btnConfirmarSalida.addEventListener(
    "click",
    () => {
        cerrarModalSalida();
        volverAlInicio();
    }
);


/* =========================================================
   ATAJO DE TECLADO: ESCAPE
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }


    /*
     Si el modal está abierto, Escape lo cierra
     sin abandonar el examen.
    */

    if (!modalSalida.hidden) {

        event.preventDefault();
        cerrarModalSalida();

        return;
    }


    /*
     Escape durante el examen:
     mostrar confirmación antes de salir.
    */

    if (!pantallaExamen.hidden) {

        event.preventDefault();
        mostrarModalSalida();

        return;
    }


    /*
     Escape durante la revisión:
     volver directamente a resultados.
    */

    if (!pantallaRevision.hidden) {

        event.preventDefault();
        mostrarPantalla(pantallaResultado);
    }
});
