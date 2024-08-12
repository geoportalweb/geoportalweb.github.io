// Definir una función para agregar tooltips a los municipios
function agregarTooltipMunicipios(feature, layer) {
    // Crear la función para mostrar u ocultar el tooltip según el nivel de zoom
    function toggleTooltip() {
        if (map.getZoom() >= 10) {
            if (!layer.getTooltip()) {
               layer.bindTooltip(feature.properties.NOMGEO, {
                    permanent: true,
                    direction: 'center',
                    className: 'noBorderTooltip'
                }).openTooltip();
            }
        } else {
            if (layer.getTooltip()) {
                layer.unbindTooltip();
            }
        }
    }

    // Ejecutar la función al cargar
    toggleTooltip();

    // Vincular la función al evento de cambio de zoom
    map.on('zoomend', toggleTooltip);

    // Definir el estilo resaltado del polígono
    var resaltadoStyle = {
        weight: 3,  // Grosor del borde
        color: "#FFFF00",  // Color del borde
        opacity: 1,  // Opacidad
        dashArray: ""  // Estilo de línea (sin guiones)
    };

    // Variables para almacenar el tooltip temporal y la posición del mouse
    var temporalTooltip;
    var mousePosition;

    // Evento 'mouseover' para resaltar el polígono y mostrar un tooltip temporal
    layer.on("mouseover", function(e) 
    {
        mousePosition = e.latlng;  // Guardar la posición del mouse

        // Contenido del tooltip temporal
        var tooltipContent = "<b>Municipio: </b>" + feature.properties.NOMGEO +
            "<br><b>Habitantes: </b>" + feature.properties.POB_TOT +
            "<br><b>Superficie (Has): </b>" + feature.properties.SUPERFIC_1;

        // Crear el tooltip temporal
        temporalTooltip = L.tooltip({

            permanent: false,  // El tooltip no es permanente
            direction: "top",  // Dirección del tooltip
            className: "tooltip-dpto"  // Clase CSS para el tooltip
        })
        .setContent(tooltipContent)  // Establecer el contenido del tooltip
        .setLatLng(mousePosition)  // Establecer la posición del tooltip
        .addTo(map);  // Agregar el tooltip al mapa

        // Aplicar el estilo resaltado al polígono
        layer.setStyle(resaltadoStyle);
    });

    // Evento 'mousemove' para actualizar la posición del tooltip temporal
    layer.on("mousemove", function(e) {
        mousePosition = e.latlng;  // Actualizar la posición del mouse
        if (temporalTooltip) {
            temporalTooltip.setLatLng(mousePosition);  // Actualizar la posición del tooltip temporal
        }
    });

    // Evento 'mouseout' para restaurar el estilo original y el tooltip permanente
    layer.on("mouseout", function(e) 
    {
                 
        var originalStyle = cargarStylePob2015(feature);  // Obtener el estilo original del polígono
        layer.setStyle(originalStyle);  // Restaurar el estilo original

        // Remover el tooltip temporal
        if (temporalTooltip) 
        {
            map.removeLayer(temporalTooltip);
            temporalTooltip = null;
        }

        // Reagregar el tooltip original
        layer.unbindTooltip();
        if (map.getZoom() >= 10) {layer.bindTooltip(feature.properties.NOMGEO, 
        {
            permanent: true,  // El tooltip es permanente
            direction: 'center',  // Dirección del tooltip
            className: 'noBorderTooltip'  // Clase CSS para el tooltip
        }).openTooltip();
    }
    });
}

// Definir una función para agregar tooltips a los nucleos
function agregarTooltipNucleos(feature, layer) {
    // Crear la función para mostrar u ocultar el tooltip según el nivel de zoom
    function toggleTooltip() {
        if (map.getZoom() >= 12) {
            if (!layer.getTooltip()) {
               layer.bindTooltip(feature.properties.Name, {
                    permanent: true,
                    direction: 'center',
                    className: 'noBorderTooltipNucleos'
                }).openTooltip();
            }
        } else {
            if (layer.getTooltip()) {
                layer.unbindTooltip();
            }
        }
    }

    // Ejecutar la función al cargar
    toggleTooltip();

    // Vincular la función al evento de cambio de zoom
    map.on('zoomend', toggleTooltip);

    // Definir el estilo resaltado del polígono
    var resaltadoStyle = {
        weight: 3,  // Grosor del borde
        color: "#00FF00",  // Color del borde
        opacity: 1,  // Opacidad
        dashArray: ""  // Estilo de línea (sin guiones)
    };

    // Variables para almacenar el tooltip temporal y la posición del mouse
    var temporalTooltip;
    var mousePosition;

    // Evento 'mouseover' para resaltar el polígono y mostrar un tooltip temporal
    layer.on("mouseover", function(e) 
    {
        mousePosition = e.latlng;  // Guardar la posición del mouse

        // Contenido del tooltip temporal
        var tooltipContent = "<b>Nucleo Agrario: </b>" + feature.properties.Name +
            "<br><b>Habitantes: </b>" + feature.properties.POB_TOT +
            "<br><b>Superficie (Has): </b>" + feature.properties.SUPERFICIE;

        // Crear el tooltip temporal
        temporalTooltip = L.tooltip({

            permanent: false,  // El tooltip no es permanente
            direction: "top",  // Dirección del tooltip
            className: "tooltip-dpto"  // Clase CSS para el tooltip
        })
        .setContent(tooltipContent)  // Establecer el contenido del tooltip
        .setLatLng(mousePosition)  // Establecer la posición del tooltip
        .addTo(map);  // Agregar el tooltip al mapa

        // Aplicar el estilo resaltado al polígono
        layer.setStyle(resaltadoStyle);
    });

    // Evento 'mousemove' para actualizar la posición del tooltip temporal
    layer.on("mousemove", function(e) {
        mousePosition = e.latlng;  // Actualizar la posición del mouse
        if (temporalTooltip) {
            temporalTooltip.setLatLng(mousePosition);  // Actualizar la posición del tooltip temporal
        }
    });

    // Evento 'mouseout' para restaurar el estilo original y el tooltip permanente
    layer.on("mouseout", function(e) 
    {
                 
        var originalStyle = cargarStyleNuc(feature);  // Obtener el estilo original del polígono
        layer.setStyle(originalStyle);  // Restaurar el estilo original

        // Remover el tooltip temporal
        if (temporalTooltip) 
        {
            map.removeLayer(temporalTooltip);
            temporalTooltip = null;
        }

        // Reagregar el tooltip original
        layer.unbindTooltip();
        if (map.getZoom() >= 12) {layer.bindTooltip(feature.properties.Name, 
        {
            permanent: true,  // El tooltip es permanente
            direction: 'center',  // Dirección del tooltip
            className: 'noBorderTooltipNucleos'  // Clase CSS para el tooltip
        }).openTooltip();
    }
    });
}
