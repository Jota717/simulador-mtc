/* =========================================================
   REVISION.JS
   Control de la pantalla de revisión de errores
========================================================= */


/* =========================================================
   MOSTRAR ERRORES
========================================================= */

function mostrarRevision() {

    /*
     Comprobar que exista un resultado.
    */

    if (!window.resultadoActual) {

        console.error(
            "No existe información del resultado."
        );

        return;
    }


    const preguntas =
        window.resultadoActual.preguntas;

    const respuestas =
        window.resultadoActual.respuestas;


    /*
     Crear una lista solamente con
     las preguntas respondidas incorrectamente.
    */

    const errores =
        preguntas
            .map((pregunta, indice) => {

                const respuesta =
                    respuestas[indice];

                return {
                    pregunta: pregunta,
                    respuestaElegida: respuesta,
                    respuestaCorrecta: pregunta.correcta
                };

            })
            .filter(error => {

                return Number(
                    error.respuestaElegida
                ) !== Number(
                    error.respuestaCorrecta
                );

            });


    const contenidoRevision =
        document.getElementById(
            "contenidoRevision"
        );


    contenidoRevision.innerHTML = "";


    errores.forEach(
        (error, indice) => {

            const bloque =
                document.createElement("div");

            bloque.className =
                "errorRevision";


            /* =================================================
            NÚMERO DE PREGUNTA
            ================================================= */

            const numero =
                document.createElement("h3");

            numero.textContent =
                `Pregunta ${indice + 1}`;

            bloque.appendChild(
                numero
            );


            /* =================================================
            TEXTO DE LA PREGUNTA
            ================================================= */

            const pregunta =
                document.createElement("p");

            pregunta.textContent =
                error.pregunta.pregunta;

            bloque.appendChild(
                pregunta
            );

            /* =================================================
            IMAGEN(ES) DE LA PREGUNTA
            ================================================= */

            let listaImagenes = [];

            if (Array.isArray(error.pregunta.imagen)) {

                listaImagenes =
                    error.pregunta.imagen.filter(
                        imagen =>
                            typeof imagen === "string" &&
                            imagen.trim() !== ""
                    );

            } else if (
                typeof error.pregunta.imagen === "string" &&
                error.pregunta.imagen.trim() !== ""
            ) {

                listaImagenes = [
                    error.pregunta.imagen
                ];
            }


            if (listaImagenes.length === 1) {

                const imagenPregunta =
                    document.createElement("img");

                imagenPregunta.src =
                    obtenerRutaImagen(
                        listaImagenes[0]
                    );

                imagenPregunta.alt =
                    "Imagen de la pregunta";

                imagenPregunta.className =
                    "imagenRevision";

                bloque.appendChild(
                    imagenPregunta
                );

            } else if (listaImagenes.length > 1) {

                const contenedorImagenes =
                    document.createElement("div");

                contenedorImagenes.className =
                    "imagenesRevisionMultiples";

                listaImagenes.forEach(
                    nombreImagen => {

                        const imagen =
                            document.createElement("img");

                        imagen.src =
                            obtenerRutaImagen(
                                nombreImagen
                            );

                        imagen.alt =
                            "Imagen de la pregunta";

                        imagen.className =
                            "imagenPreguntaExtra";

                        contenedorImagenes.appendChild(
                            imagen
                        );
                    }
                );

                bloque.appendChild(
                    contenedorImagenes
                );
            }

            /* =================================================
            ALTERNATIVAS
            ================================================= */

            if (!Array.isArray(error.pregunta.opciones)) {
                console.error(
                    "La pregunta no contiene un arreglo de opciones.",
                    error.pregunta
                );

                return;
            }


            error.pregunta.opciones.forEach(
                (opcion, indiceOpcion) => {

                    const contenido =
                        crearContenidoAlternativa(
                            opcion,
                            indiceOpcion
                        );

                    if (!contenido) {
                        return;
                    }


                    const alternativa =
                        document.createElement("div");

                    alternativa.className =
                        "alternativaRevision";

                    alternativa.appendChild(
                        contenido
                    );


                    /* =========================================
                    IDENTIFICAR RESPUESTA ELEGIDA
                    ========================================= */

                    if (
                        indiceOpcion ===
                        Number(error.respuestaElegida)
                    ) {

                        alternativa.classList.add(
                            "respuestaElegida"
                        );
                    }


                    /* =========================================
                    IDENTIFICAR RESPUESTA CORRECTA
                    ========================================= */

                    if (
                        indiceOpcion ===
                        Number(error.respuestaCorrecta)
                    ) {

                        alternativa.classList.add(
                            "respuestaCorrecta"
                        );
                    }


                    bloque.appendChild(
                        alternativa
                    );

                }
            );

            contenidoRevision.appendChild(
                bloque
            );

        }
    );
}

/* =========================================================
   BOTONES DE LA REVISIÓN
========================================================= */


/* ---------------------------------------------------------
   NUEVO EXAMEN
--------------------------------------------------------- */

document.getElementById(
    "btnNuevoExamenRevision"
).addEventListener(
    "click",
    () => {

        iniciarExamen(
            modoActual,
            cantidadActual
        );

    }
);


/* ---------------------------------------------------------
   IR AL INICIO
--------------------------------------------------------- */

document.getElementById(
    "btnInicioRevision"
).addEventListener(
    "click",
    volverAlInicio
);

/* ---------------------------------------------------------
   VOLVER AL RESULTADO
--------------------------------------------------------- */

document.getElementById(
    "btnVolverResultado"
).addEventListener(
    "click",
    () => {

        mostrarPantalla(pantallaResultado);

    }
);

/* =========================================================
   DISPONIBLE PARA OTROS ARCHIVOS
========================================================= */

window.mostrarRevision =
    mostrarRevision;
