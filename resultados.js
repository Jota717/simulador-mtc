/* =========================================================
   RESULTADOS.JS
   Control de la pantalla de resultados
========================================================= */


/* =========================================================
   MOSTRAR RESULTADOS
========================================================= */

function mostrarResultado() {

    /*
     Comprobar que exista un resultado.
    */

    if (!window.resultadoActual) {

        console.error(
            "No existe información del resultado."
        );

        return;
    }


    /* =====================================================
       DATOS DEL RESULTADO
    ===================================================== */

    const resultado =
        window.resultadoActual;


    const porcentaje =
        resultado.porcentaje;

    const correctas =
        resultado.correctas;

    const incorrectas =
        resultado.incorrectas;

    const cantidad =
        resultado.cantidad;

    const modo =
        resultado.modo;


    /* =====================================================
       CAMBIAR DE PANTALLA
    ===================================================== */

    mostrarPantalla(pantallaResultado);


    /* =====================================================
       CONTENEDOR
    ===================================================== */

    const contenidoResultado =
        document.getElementById(
            "contenidoResultado"
        );


    contenidoResultado.innerHTML = "";


    /* =====================================================
    TÍTULO DEL RESULTADO
    ===================================================== */

    const tituloResultado =
        document.createElement("h2");

    tituloResultado.className =
        "tituloResultado";


    if (modo === "estudio") {

        tituloResultado.textContent =
            "¡Sesión completada!";

    } else if (correctas >= 35) {

        tituloResultado.textContent =
            "¡Felicitaciones! 🏆";

    } else {

        tituloResultado.textContent =
            "¡Sigue practicando! 💪";
    }

    /* =====================================================
       TARJETA PRINCIPAL
    ===================================================== */

    const tarjeta =
        document.createElement("div");

    tarjeta.className =
        "tarjetaResultado";


    /* =====================================================
       BLOQUE DEL PORCENTAJE
    ===================================================== */

    const bloquePorcentaje =
        document.createElement("div");

    bloquePorcentaje.className =
        "bloquePorcentaje";


    const porcentajeTexto =
        document.createElement("div");

    porcentajeTexto.className =
        "porcentajeResultado";

    porcentajeTexto.textContent =
        `${porcentaje}%`;


    const grafico =
        document.createElement("div");

    grafico.className =
        "graficoResultado";


    grafico.style.setProperty(
        "--porcentaje",
        `${porcentaje}%`
    );

    grafico.style.setProperty(
        "--angulo-punta",
        `${porcentaje * 3.6}deg`
    );

    if (porcentaje <= 0) {
        grafico.classList.add("sinProgreso");
    }

    const puntaInicio =
        document.createElement("span");

    puntaInicio.className =
        "puntaGrafico puntaInicio";

    puntaInicio.style.setProperty(
        "--angulo-punta",
        "0deg"
    );

    const puntaFin =
        document.createElement("span");

    puntaFin.className =
        "puntaGrafico puntaFin";

    grafico.appendChild(puntaInicio);
    grafico.appendChild(puntaFin);

    grafico.appendChild(
        porcentajeTexto
    );

    bloquePorcentaje.appendChild(
        grafico

    );


    /* =====================================================
    BLOQUE DE DATOS
    ===================================================== */

    const bloqueDatos =
        document.createElement("div");

    bloqueDatos.className =
        "bloqueDatos";


    /* -----------------------------------------------------
    FUNCIÓN PARA CREAR UNA TARJETA DE DATO
    ----------------------------------------------------- */

    function crearTarjetaDato(
        valor,
        nombre,
        clase
    ) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            `datoResultado ${clase}`;


        const valorElemento =
            document.createElement("span");

        valorElemento.className =
            "valorDato";

        valorElemento.textContent =
            valor;


        const nombreElemento =
            document.createElement("span");

        nombreElemento.className =
            "nombreDato";

        nombreElemento.textContent =
            nombre;


        tarjeta.appendChild(
            valorElemento
        );

        tarjeta.appendChild(
            nombreElemento
        );


        return tarjeta;
    }


    /* -----------------------------------------------------
    CORRECTAS
    ----------------------------------------------------- */

    const datoCorrectas =
        crearTarjetaDato(
            correctas,
            "Correctas",
            "datoCorrectas"
        );


    /* -----------------------------------------------------
    INCORRECTAS
    ----------------------------------------------------- */

    const datoIncorrectas =
        crearTarjetaDato(
            incorrectas,
            "Incorrectas",
            "datoIncorrectas"
        );


    /* -----------------------------------------------------
    PREGUNTAS
    ----------------------------------------------------- */

    const datoCantidad =
        crearTarjetaDato(
            cantidad,
            "Preguntas",
            "datoPreguntas"
        );


    /* =====================================================
    ARMAR BLOQUE DE DATOS
    ===================================================== */

    const contenidoDatos =
        document.createElement("div");

    contenidoDatos.className =
        "contenidoDatos";


    /* -----------------------------------------------------
    TÍTULO
    ----------------------------------------------------- */

    contenidoDatos.appendChild(
        tituloResultado
    );


    /* -----------------------------------------------------
    TARJETAS
    ----------------------------------------------------- */

    const tarjetasDatos =
        document.createElement("div");

    tarjetasDatos.className =
        "tarjetasDatos";


    tarjetasDatos.appendChild(
        datoCorrectas
    );

    tarjetasDatos.appendChild(
        datoIncorrectas
    );

    tarjetasDatos.appendChild(
        datoCantidad
    );


    /* -----------------------------------------------------
    UNIR CONTENIDO
    ----------------------------------------------------- */

    contenidoDatos.appendChild(
        tarjetasDatos
    );

    /* -----------------------------------------------------
    MENSAJE INFORMATIVO
    ----------------------------------------------------- */

    const mensajeResultado =
        document.createElement("p");

    mensajeResultado.className =
        "mensajeResultado";

    if (modo === "estudio") {

        mensajeResultado.classList.add(
            "mensajeEstudio"
        );

    } else if (correctas >= 35) {

        mensajeResultado.classList.add(
            "mensajeAprobado"
        );

    } else {

        mensajeResultado.classList.add(
            "mensajeDesaprobado"
        );
    }        

    if (modo === "estudio") {

        mensajeResultado.textContent =
            "Has completado esta sesión de estudio.";

    } else if (correctas >= 35) {

        mensajeResultado.textContent =
            "¡Has aprobado el simulacro! Estás listo para tu examen.";

    } else {

        mensajeResultado.textContent =
            "No alcanzaste el mínimo de 35 respuestas correctas. ¡Sigue practicando!";
    }


    contenidoDatos.appendChild(
        mensajeResultado
    );

    bloqueDatos.appendChild(
        contenidoDatos
    );


    /* =====================================================
       ARMAR TARJETA
    ===================================================== */

    tarjeta.appendChild(
        bloquePorcentaje
    );

    tarjeta.appendChild(
        bloqueDatos
    );


    /* =====================================================
    BOTONES DE RESULTADOS
    ===================================================== */

    const botonesResultado =
        document.createElement("div");

    botonesResultado.className =
        "botonesResultado";


    /* -----------------------------------------------------
    REVISAR ERRORES
    ----------------------------------------------------- */

    const btnRevisarErrores =
        document.createElement("button");

    btnRevisarErrores.type =
        "button";

    btnRevisarErrores.className =
        "botonAccion botonSecundario";

    btnRevisarErrores.textContent =
        "Revisar errores";

    btnRevisarErrores.addEventListener(
        "click",
        () => {

            if (window.resultadoActual.incorrectas === 0) {

                mensajeSinErrores.hidden = false;

                return;
            }

            mostrarPantalla(pantallaRevision);
            mostrarRevision();

        }
    );    

    /* -----------------------------------------------------
    NUEVO EXAMEN
    ----------------------------------------------------- */

    const btnNuevoExamen =
        document.createElement("button");

    btnNuevoExamen.type =
        "button";

    btnNuevoExamen.className =
        "botonAccion botonPrincipal";

    btnNuevoExamen.textContent =
        "Nuevo examen";

    btnNuevoExamen.addEventListener(
        "click",
        () => iniciarExamen(modoActual, cantidadActual)
    );        


    /* -----------------------------------------------------
    IR AL INICIO
    ----------------------------------------------------- */

    const btnIrInicio =
        document.createElement("button");

    btnIrInicio.type =
        "button";

    btnIrInicio.className =
        "botonAccion botonSecundario";

    btnIrInicio.textContent =
        "Ir al inicio";

    btnIrInicio.addEventListener(
        "click",
        volverAlInicio
    );     

    /* -----------------------------------------------------
    AGREGAR BOTONES
    ----------------------------------------------------- */

    botonesResultado.appendChild(
        btnRevisarErrores
    );

    botonesResultado.appendChild(
        btnNuevoExamen
    );

    botonesResultado.appendChild(
        btnIrInicio
    );


    /* -----------------------------------------------------
    AGREGAR BLOQUE A LA TARJETA
    ----------------------------------------------------- */

    tarjeta.appendChild(
        botonesResultado
    );

    const mensajeSinErrores =
        document.createElement("div");

    mensajeSinErrores.className =
        "mensajeSinErrores";

    mensajeSinErrores.hidden = true;

    mensajeSinErrores.textContent =
        "🎉 No tienes errores para revisar.";

    tarjeta.appendChild(
        mensajeSinErrores
    );

    contenidoResultado.appendChild(
        tarjeta
    );

}


/* =========================================================
   DISPONIBLE PARA EXAMEN.JS
========================================================= */

window.mostrarResultado =
    mostrarResultado;