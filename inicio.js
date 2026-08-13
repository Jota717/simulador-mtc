/* =========================================================
   INICIO.JS
   Control de la pantalla inicial
========================================================= */


/* =========================================================
   ELEMENTOS DE LA PANTALLA
========================================================= */

const btnComenzar =
    document.getElementById("btnComenzar");


/* =========================================================
   CAMBIO DE MODO
========================================================= */

const radiosModo =
    document.querySelectorAll(
        'input[name="modo"]'
    );


radiosModo.forEach(radio => {

    radio.addEventListener(
        "change",
        cambiarModo
    );

});


function cambiarModo() {

    const modoSeleccionado =
        document.querySelector(
            'input[name="modo"]:checked'
        ).value;


    if (modoSeleccionado === "examen") {

        /*
         En modo Examen no se muestra
         la selección de cantidad.
        */

        opcionesEstudio.hidden = true;


    } else {

        /*
         En modo Estudio sí se muestran
         las opciones de cantidad.
        */

        opcionesEstudio.hidden = false;
    }
}


/* =========================================================
   CAMBIO DE CANTIDAD
========================================================= */

const radiosCantidad =
    document.querySelectorAll(
        'input[name="cantidad"]'
    );


radiosCantidad.forEach(radio => {

    radio.addEventListener(
        "change",
        cambiarCantidad
    );

});


function cambiarCantidad() {

    const cantidadSeleccionada =
        document.querySelector(
            'input[name="cantidad"]:checked'
        ).value;


    /* -----------------------------------------
       PERSONALIZADO
    ----------------------------------------- */

    if (
        cantidadSeleccionada ===
        "personalizado"
    ) {

        /*
         El campo empieza vacío.
        */

        cantidadPersonalizada.value = "";


        /*
         Se habilita.
        */

        cantidadPersonalizada.disabled = false;


        /*
         El cursor entra automáticamente
         al campo.
        */

        cantidadPersonalizada.focus();


        return;
    }


    /* -----------------------------------------
       40 / TODAS
    ----------------------------------------- */

    cantidadPersonalizada.value = "";

    cantidadPersonalizada.disabled = true;
}


/* =========================================================
   BOTÓN COMENZAR
========================================================= */

btnComenzar.addEventListener(
    "click",
    iniciarSimulador
);


function iniciarSimulador() {

    const modo =
        document.querySelector(
            'input[name="modo"]:checked'
        ).value;


    let cantidad;


    /* -----------------------------------------
       MODO EXAMEN
    ----------------------------------------- */

    if (modo === "examen") {

        cantidad = 40;
    }


    /* -----------------------------------------
       MODO ESTUDIO
    ----------------------------------------- */

    else {

        const cantidadSeleccionada =
            document.querySelector(
                'input[name="cantidad"]:checked'
            ).value;


        if (
            cantidadSeleccionada ===
            "40"
        ) {

            cantidad = 40;

        } else if (
            cantidadSeleccionada ===
            "todas"
        ) {

            cantidad = "todas";

        } else if (
            cantidadSeleccionada ===
            "personalizado"
        ) {

            const valor =
                cantidadPersonalizada.value.trim();


            if (valor === "") {

                alert(
                    "Ingresa la cantidad de preguntas."
                );

                cantidadPersonalizada.focus();

                return;
            }


            cantidad =
                Number(valor);


            if (
                !Number.isInteger(cantidad) ||
                cantidad < 1
            ) {

                alert(
                    "Ingresa una cantidad válida de preguntas."
                );

                cantidadPersonalizada.focus();

                return;
            }
        }
    }

    iniciarExamen(modo, cantidad);
}

/* =========================================================
   ENTER EN LA PANTALLA DE INICIO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        /* -----------------------------------------
           PERSONALIZADO
        ----------------------------------------- */

        if (
            document.activeElement ===
            cantidadPersonalizada
        ) {

            /*
             Si está vacío, no iniciar.
            */

            if (
                cantidadPersonalizada.value.trim() === ""
            ) {

                event.preventDefault();

                return;
            }


            /*
             Si tiene una cantidad:
             el primer Enter solo lleva
             el foco a Comenzar.
            */

            event.preventDefault();

            btnComenzar.focus();

            return;
        }


        /* -----------------------------------------
           BOTÓN COMENZAR
        ----------------------------------------- */

        if (
            document.activeElement ===
            btnComenzar
        ) {

            /*
             Dejar que el Enter normal del botón
             ejecute iniciarSimulador().
            */

            return;
        }


        /* -----------------------------------------
           40 / TODAS / EXAMEN
        ----------------------------------------- */

        if (
            !pantallaInicio.hidden
        ) {

            /*
             Iniciar directamente.
            */

            event.preventDefault();

            btnComenzar.click();
        }

    }
);
