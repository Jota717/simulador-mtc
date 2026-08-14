/* =========================================================
   EXAMEN.JS
   Control de la lógica del examen
========================================================= */


/* =========================================================
   VARIABLES DEL EXAMEN
========================================================= */

let preguntas = [];

let preguntasExamen = [];

let indiceActual = 0;

let modoActual = "";

let cantidadActual = 0;

let puntaje = 0;

let respuestasUsuario = [];

let respondida = false;


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const contador =
    document.getElementById("contador");

const preguntaElemento =
    document.getElementById("pregunta");

const contenedorImagen =
    document.getElementById("contenedorImagen");

const imagenPregunta =
    document.getElementById("imagenPregunta");

const opciones =
    document.getElementById("opciones");

const btnSiguiente =
    document.getElementById("btnSiguiente");

const porcentajeProgreso =
    document.getElementById("porcentajeProgreso");

const barraProgresoActual =
    document.getElementById("barraProgresoActual");


/* =========================================================
   CARGAR PREGUNTAS
========================================================= */

async function cargarPreguntas() {

    /*
     Si ya fueron cargadas anteriormente,
     no las volvemos a cargar.
    */

    if (preguntas.length > 0) {
        return;
    }


    try {

        const respuesta =
            await fetch("Data/preguntas.json");


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );
        }


        preguntas =
            await respuesta.json();


        /*
         Comprobamos que realmente sea
         un arreglo.
        */

        if (!Array.isArray(preguntas)) {

            throw new Error(
                "El contenido de preguntas.json no es un arreglo."
            );
        }


    } catch (error) {

        console.error(
            "Error al cargar preguntas.json:",
            error
        );


        alert(
            "No se pudieron cargar las preguntas."
        );


        throw error;
    }
}


/* =========================================================
   INICIAR EXAMEN
========================================================= */

async function iniciarExamen(
    modo,
    cantidad
) {

    /*
     Primero nos aseguramos de tener
     cargado el banco de preguntas.
    */

    try {

        await cargarPreguntas();

    } catch {

        return;
    }


    /* -----------------------------------------------------
       Guardar modo
    ----------------------------------------------------- */

    modoActual = modo;
    document.getElementById("tituloModo").textContent =
        modo === "examen"
            ? "Modo Examen"
            : "Modo Estudio";

    /* -----------------------------------------------------
       Determinar cantidad
    ----------------------------------------------------- */

    if (cantidad === "todas") {

        cantidadActual =
            preguntas.length;

    } else {

        cantidadActual =
            Number(cantidad);
    }


    /* -----------------------------------------------------
       Validar cantidad
    ----------------------------------------------------- */

    if (
        !Number.isInteger(cantidadActual) ||
        cantidadActual < 1
    ) {

        alert(
            "La cantidad de preguntas no es válida."
        );

        return;
    }


    if (
        cantidadActual > preguntas.length
    ) {

        alert(
            `El banco contiene ${preguntas.length} preguntas. ` +
            `No puedes seleccionar ${cantidadActual}.`
        );

        return;
    }


    /* -----------------------------------------------------
       Mezclar preguntas
    ----------------------------------------------------- */

    const preguntasMezcladas =
        [...preguntas];


    for (
        let i = preguntasMezcladas.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            preguntasMezcladas[i],
            preguntasMezcladas[j]
        ] = [
            preguntasMezcladas[j],
            preguntasMezcladas[i]
        ];
    }


    /* -----------------------------------------------------
       Seleccionar preguntas
    ----------------------------------------------------- */

    preguntasExamen =
        preguntasMezcladas.slice(
            0,
            cantidadActual
        );


    /* -----------------------------------------------------
       Reiniciar posición
    ----------------------------------------------------- */

    indiceActual = 0;


    /* -----------------------------------------------------
       Preparar pantalla
    ----------------------------------------------------- */

    limpiarPantallaExamen();
    mostrarPantalla(pantallaExamen);

    /* -----------------------------------------------------
       Mostrar primera pregunta
    ----------------------------------------------------- */

    mostrarPregunta();
}


/* =========================================================
   LIMPIAR PANTALLA DE EXAMEN
========================================================= */

function limpiarPantallaExamen() {

    contador.textContent = "";

    preguntaElemento.textContent = "";

    opciones.innerHTML = "";

    contenedorImagen.hidden = true;

    imagenPregunta.src = "";

    porcentajeProgreso.textContent = "0%";

    barraProgresoActual.style.width = "0%";

    puntaje = 0;

    respuestasUsuario = [];

    respondida = false;

    btnSiguiente.disabled = true;
}


/* =========================================================
   MOSTRAR PREGUNTA
========================================================= */

function mostrarPregunta() {

    const preguntaActual =
        preguntasExamen[indiceActual];


    if (!preguntaActual) {

        console.error(
            "No se encontró la pregunta actual."
        );

        return;
    }

    if (indiceActual === preguntasExamen.length - 1) {
        btnSiguiente.textContent = "Finalizar";
    } else {
        btnSiguiente.textContent = "Siguiente";
    }

    respondida = false;
    btnSiguiente.disabled = true;

    /* -----------------------------------------------------
       CONTADOR
    ----------------------------------------------------- */

    contador.textContent =
        `Pregunta ${indiceActual + 1} de ${preguntasExamen.length}`;


    /* -----------------------------------------------------
       TEXTO DE LA PREGUNTA
    ----------------------------------------------------- */

    preguntaElemento.textContent =
        preguntaActual.pregunta;


    /* -----------------------------------------------------
       IMAGEN DE LA PREGUNTA
    ----------------------------------------------------- */

    mostrarImagenPregunta(
        preguntaActual
    );


    /* -----------------------------------------------------
       ALTERNATIVAS
    ----------------------------------------------------- */

    mostrarAlternativas(
        preguntaActual
    );


    /* -----------------------------------------------------
       PROGRESO
    ----------------------------------------------------- */

    actualizarProgreso();
}


/* =========================================================
   MOSTRAR IMAGEN(ES) DE LA PREGUNTA
========================================================= */

function mostrarImagenPregunta(preguntaActual) {

    /*
     Eliminar imágenes adicionales
     creadas por la pregunta anterior.
    */

    const imagenesExtra =
        contenedorImagen.querySelectorAll(
            ".imagenPreguntaExtra"
        );

    imagenesExtra.forEach(
        imagen => imagen.remove()
    );


    /*
     Construir la lista de imágenes.

     Se admiten:

     "imagen": "imagen.png"

     o

     "imagenes": [
         "imagen1.png",
         "imagen2.png"
     ]
    */

    let listaImagenes = [];


    /* -----------------------------------------
    IMAGEN / IMÁGENES
    ----------------------------------------- */

    if (
        Array.isArray(
            preguntaActual.imagen
        )
    ) {

        /*
        La pregunta tiene varias imágenes.
        */

        listaImagenes =
            preguntaActual.imagen.filter(
                imagen =>
                    typeof imagen === "string" &&
                    imagen.trim() !== ""
            );

    } else if (
        typeof preguntaActual.imagen === "string" &&
        preguntaActual.imagen.trim() !== ""
    ) {

        /*
        La pregunta tiene una sola imagen.
        */

        listaImagenes = [
            preguntaActual.imagen
        ];
    }


    /* -----------------------------------------
       SIN IMÁGENES
    ----------------------------------------- */

    if (listaImagenes.length === 0) {

        imagenPregunta.removeAttribute("src");

        imagenPregunta.alt =
            "Imagen de la pregunta";

        contenedorImagen.hidden = true;

        return;
    }


    /* -----------------------------------------
       PRIMERA IMAGEN
    ----------------------------------------- */

    imagenPregunta.src =
        obtenerRutaImagen(
            listaImagenes[0]
        );

    imagenPregunta.alt =
        "Imagen de la pregunta";


    /* -----------------------------------------
       IMÁGENES ADICIONALES
    ----------------------------------------- */

    for (
        let i = 1;
        i < listaImagenes.length;
        i++
    ) {

        const nuevaImagen =
            document.createElement("img");

        nuevaImagen.className =
            "imagenPreguntaExtra";

        nuevaImagen.src =
            obtenerRutaImagen(
                listaImagenes[i]
            );

        nuevaImagen.alt =
            "Imagen de la pregunta";

        contenedorImagen.appendChild(
            nuevaImagen
        );
    }


    /* -----------------------------------------
       MOSTRAR CONTENEDOR
    ----------------------------------------- */

    contenedorImagen.hidden = false;
} 


/* =========================================================
   MOSTRAR ALTERNATIVAS
========================================================= */

function mostrarAlternativas(
    preguntaActual
) {

    opciones.innerHTML = "";


    /*
     Comprobamos que exista el arreglo
     de opciones.
    */

    if (
        !Array.isArray(
            preguntaActual.opciones
        )
    ) {

        console.error(
            "La pregunta no contiene un arreglo de opciones.",
            preguntaActual
        );

        return;
    }


    preguntaActual.opciones.forEach(
        (opcion, indice) => {

            const contenido =
                crearContenidoAlternativa(
                    opcion,
                    indice
                );

            if (!contenido) {
                return;
            }


            const boton =
                document.createElement("button");

            boton.type = "button";

            boton.addEventListener(
                "click",
                () => seleccionarRespuesta(indice)
            );


            boton.appendChild(
                contenido
            );


            opciones.appendChild(
                boton
            );
        }
    );
}

/* =========================================================
   SELECCIONAR RESPUESTA
========================================================= */

function seleccionarRespuesta(indiceSeleccionado) {

    const preguntaActual =
        preguntasExamen[indiceActual];

    const botones =
        opciones.querySelectorAll("button");

    const respuestaCorrecta =
        Number(preguntaActual.correcta);


    /* =====================================================
       MODO ESTUDIO
    ===================================================== */

    if (modoActual === "estudio") {

        /*
         En estudio no se puede cambiar
         la respuesta después de seleccionarla.
        */

        if (respondida) {
            return;
        }


        respondida = true;


        /*
         Guardar la respuesta.
        */

        respuestasUsuario[indiceActual] =
            indiceSeleccionado;


        /*
         Comprobar si es correcta.
        */

        const esCorrecta =
            indiceSeleccionado === respuestaCorrecta;


        if (esCorrecta) {

            puntaje++;
        }


        /*
         Desactivar todas las alternativas.
        */

        botones.forEach(
            (boton, indice) => {

                boton.disabled = true;


                /*
                 Mostrar la respuesta correcta.
                */

                if (
                    indice === respuestaCorrecta
                ) {

                    boton.classList.add(
                        "correcta"
                    );
                }


                /*
                 Si la seleccionada fue incorrecta,
                 marcarla en rojo.
                */

                if (
                    indice === indiceSeleccionado &&
                    !esCorrecta
                ) {

                    boton.classList.add(
                        "incorrecta"
                    );
                }
            }
        );


        /*
         Actualizar progreso.
        */

        actualizarProgreso();


        /*
         Habilitar Siguiente.
        */

        btnSiguiente.disabled = false;


        return;
    }


    /* =====================================================
       MODO EXAMEN
    ===================================================== */

    if (modoActual === "examen") {

        /*
         En examen SÍ se puede cambiar
         la respuesta antes de avanzar.
        */

        respuestasUsuario[indiceActual] =
            indiceSeleccionado;


        /*
         Quitar la selección anterior
         de todas las alternativas.
        */

        botones.forEach(
            boton => {

                boton.classList.remove(
                    "seleccionada"
                );
            }
        );


        /*
         Marcar únicamente la alternativa
         actualmente seleccionada.
        */

        if (botones[indiceSeleccionado]) {

            botones[indiceSeleccionado]
                .classList.add(
                    "seleccionada"
                );
        }


        /*
         La pregunta ya tiene una respuesta
         seleccionada, por lo tanto se puede avanzar.
        */

        respondida = true;

        btnSiguiente.disabled = false;
    }
}

/* =========================================================
   ACTUALIZAR PROGRESO
========================================================= */

/* =========================================================
   ACTUALIZAR PROGRESO
========================================================= */

function actualizarProgreso() {

    const respondidas =
        respuestasUsuario.filter(
            respuesta =>
                respuesta !== undefined
        ).length;


    const porcentaje =
        Math.round(
            (
                respondidas /
                preguntasExamen.length
            ) * 100
        );


    porcentajeProgreso.textContent =
        `${porcentaje}%`;


    barraProgresoActual.style.width =
        `${porcentaje}%`;
}

/* =========================================================
   SIGUIENTE PREGUNTA
========================================================= */

btnSiguiente.addEventListener(
    "click",
    siguientePregunta
);

/* =========================================================
   SIGUIENTE PREGUNTA
========================================================= */

function siguientePregunta() {

    /*
     No avanzar si no se ha seleccionado
     una respuesta.
    */

    if (!respondida) {
        return;
    }


    /* =====================================================
       MODO EXAMEN
       La respuesta se corrige recién al avanzar.
    ===================================================== */

    if (modoActual === "examen") {

        const preguntaActual =
            preguntasExamen[indiceActual];

        const respuestaSeleccionada =
            respuestasUsuario[indiceActual];

        const respuestaCorrecta =
            Number(preguntaActual.correcta);


        if (
            respuestaSeleccionada ===
            respuestaCorrecta
        ) {

            puntaje++;
        }
    }


    /*
     Pasar a la siguiente pregunta.
    */

    indiceActual++;


    /*
     Si todavía quedan preguntas,
     mostrar la siguiente.
    */

    if (
        indiceActual <
        preguntasExamen.length
    ) {

        mostrarPregunta();

        return;
    }

    /*
    Llegamos al final.
    */

    /*
    Guardar los datos del resultado
    para que resultados.js pueda utilizarlos.
    */

    window.resultadoActual = {
        modo: modoActual,
        cantidad: preguntasExamen.length,
        correctas: puntaje,
        incorrectas:
            preguntasExamen.length - puntaje,
        porcentaje:
            Math.round(
                (puntaje / preguntasExamen.length) * 100
            ),
        preguntas: preguntasExamen,
        respuestas: respuestasUsuario
    };


    /*
    Mostrar la pantalla de resultados.
    */

    mostrarResultado();
}

/* =========================================================
   FUNCIONES DISPONIBLES PARA OTROS ARCHIVOS
========================================================= */

window.iniciarExamen =
    iniciarExamen;

window.mostrarPregunta =
    mostrarPregunta;

    /* =========================================================
   ENTER PARA AVANZAR
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Enter") {
        return;
    }

    /*
     Solo reaccionar si estamos
     realmente en la pantalla de examen.
    */

    if (pantallaExamen.hidden) {
        return;
    }

    /*
     Solo avanzar si ya se seleccionó
     una alternativa.
    */

    if (!respondida) {
        return;
    }

    /*
     Evitar que Enter provoque
     otros comportamientos del navegador.
    */

    event.preventDefault();

    /*
     Hacer lo mismo que presionar
     el botón Siguiente / Finalizar.
    */

    siguientePregunta();
});
