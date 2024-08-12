// Crear el mapa y establecer la vista inicial
var map = L.map("map", {
    
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topright'
    }
}).setView([19.57110, -100.333650], 12);

// Añadir capas base
var googleStreets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
var googleSat = L.tileLayer("http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}").addTo(map);

window.map = map; 

// Configurar el control de medida
L.Measure = {
    linearMeasurement: "Medir Distancia",
    areaMeasurement: "Medir Área",
    start: "0",
    meter: "m",
    kilometer: "km",
    squareMeter: "m²",
    squareKilometers: "km²",
    hectares: "ha",
    hectaresDecimals: 2 // Ajustar el número de decimales si es necesario
};

// Añadir el control de medida al mapa
var measureControl = L.control.measure({
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'hectares',
    activeColor: '#ABE67E',
    completedColor: '#C8F2BE'
}).addTo(map);

// Mover el control de medición al contenedor del sidebar
document.getElementById('measureControl').appendChild(measureControl.getContainer());
measureControl._container.classList.add('measureControl');

// Crear una capa GeoJSON para corrientes de agua con estilo y popups personalizados
var corrientes_agua = L.geoJSON(corrientes_de_agua, {
    style: rasgo_principal_rh_style,
    onEachFeature: popupRedHidrica
});

//Agregar Archivos GeoJSON de Pasivos Ambientales Mineros
var cluster_pam = L.markerClusterGroup();

var zonas_afec_in     = L.geoJSON(zonas_afectadas_por_incendios, {
                                                onEachFeature   : cargarIconPam
});

cluster_pam.addLayer(zonas_afec_in);
//map.addLayer(cluster_pam);

// Crear una capa GeoJSON para el municipio de Ocampo y añadirla al mapa
var municipio_ocampo = L.geoJSON(municipio_ocampo_epsg).addTo(map);

// Añadir un tooltip permanente al municipio de Ocampo
municipio_ocampo.bindTooltip("Ocampo", {
    permanent: true, // Tooltip permanente
    direction: 'center', // Dirección del tooltip
    className: 'noBorderTooltip' // Clase CSS personalizada para el tooltip
}).openTooltip();

// Crear una capa GeoJSON para localidades con iconos personalizados y popups
var localidades = L.geoJSON(localidades, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: localidades_ocampo_icon // Icono personalizado para cada marcador
        });
    },
    onEachFeature: popupRestosArqueologicos // Función para añadir popups a cada localidad
});

// Crear una capa GeoJSON para localidades de Ocampo con iconos personalizados
var localidades_ocampo = L.geoJSON(localidades_ocampo, {
    onEachFeature: cargarIconPam // Función para cargar iconos personalizados
});

// Crear una capa GeoJSON para municipios colindantes con estilos personalizados y popups
var municipios_pob_tot = L.geoJSON(municipios_poblacion_total, {
    style: cargarStylePob2015, // Estilo personalizado para la capa
    onEachFeature: agregarTooltipMunicipios // Función para añadir tooltips a cada municipio
}).addTo(map);
// Crear una capa GeoJSON para nucleos agrarios con estilos personalizados y popups
var nucleos_pob_tot = L.geoJSON(nucleos_agrarios_con_pob_total, {
    style: cargarStyleNuc, // Estilo personalizado para la capa
    onEachFeature: agregarTooltipNucleos // Función para añadir tooltips a cada municipio
}).addTo(map);


//console.log(zonas_afectadas_por_incendios);
//----------------INICIO MAPA DE CALOR---------------------------------------------------------------

//Convertir los puntos a una lista de coordenadas para el mapa de calor
/*
var heatData = zonas_afectadas_por_incendios.features.map(function(feature){
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
});

//console.log(heatData);

//Crear la capa de mapa de calor
var heatLayer = L.heatLayer(heatData,{
    radius: 50
});*/



//////////////////////////////////////////////////////////////////////


//----------------FIN MAPA DE CALOR--------------------------------------------------------------

// Función para actualizar la leyenda según las capas visibles en el mapa
function actualizarLeyenda() {
    var visibleLegends = []; // Array para almacenar las leyendas visibles

    // Añadir la leyenda del municipio de Ocampo si la capa está visible
    if (map.hasLayer(municipio_ocampo)) {
        visibleLegends.push({
            label: "Municipio de Ocampo", // Etiqueta de la leyenda
            type: "rectangle", // Tipo de símbolo de la leyenda
            color: "#03ADFD", // Color del símbolo
            weight: 2, // Grosor del borde
            dashArray: 0, // Patrón de línea
            layers: municipio_ocampo // Capa asociada a la leyenda
        });
    }

    // Añadir la leyenda de municipios colindantes si la capa está visible
    if (map.hasLayer(municipios_pob_tot)) {
        visibleLegends.push({
            label: "Municipios Michoacán", // Etiqueta de la leyenda
            type: "rectangle", // Tipo de símbolo de la leyenda
            color: "#FFFF00", // Color del símbolo
            weight: 2, // Grosor del borde
            dashArray: 0, // Patrón de línea
            layers: municipios_pob_tot // Capa asociada a la leyenda
        });
    }

    // Añadir la leyenda de nucleos si la capa está visible
    if (map.hasLayer(nucleos_pob_tot)) {
        visibleLegends.push({
            label: "Núcleos A. de Zitácuaro", // Etiqueta de la leyenda
            type: "rectangle", // Tipo de símbolo de la leyenda
            color: "#00FF00", // Color del símbolo
            weight: 2, // Grosor del borde
            dashArray: 0, // Patrón de línea
            layers: nucleos_pob_tot // Capa asociada a la leyenda
        });
    }

    // Añadir la leyenda de localidades si la capa está visible
    if (map.hasLayer(localidades)) {
        visibleLegends.push({
            label: "Localidades", // Etiqueta de la leyenda
            type: "image", // Tipo de símbolo de la leyenda
            url: "plugins/images/restos_arqueologicos.png", // URL de la imagen del símbolo
            layers: localidades // Capa asociada a la leyenda
        });
    }

    // Añadir la leyenda de corrientes de agua si la capa está visible
    if (map.hasLayer(corrientes_agua)) {
        visibleLegends.push({
            label: "PERENNE", // Etiqueta de la leyenda
            type: "polyline", // Tipo de símbolo de la leyenda
            color: "blue", // Color del símbolo
            weight: 4, // Grosor de la línea
            opacity: 1, // Opacidad de la línea
            layers: corrientes_agua // Capa asociada a la leyenda
        });

        visibleLegends.push({
            label: "INTERMITENTE", // Etiqueta de la leyenda
            type: "polyline", // Tipo de símbolo de la leyenda
            color: "#00FFFB", // Color del símbolo
            weight: 2.5, // Grosor de la línea
            opacity: 1, // Opacidad de la línea
            dashArray: [5, 10, 1], // Patrón de línea
            layers: corrientes_agua // Capa asociada a la leyenda
        });
    }

    // Añadir la leyenda de localidades si la capa está visible
    if (map.hasLayer(zonas_afec_in)) {

        visibleLegends.push({
            label: "Zonas Afectadas", // Etiqueta de la leyenda
            type: "image", // Tipo de símbolo de la leyenda
            url: "plugins/images/restos_arqueologicos.png", // URL de la imagen del símbolo
            layers: zonas_afec_in // Capa asociada a la leyenda
        });
    }

    // Remover la leyenda existente y añadir la nueva leyenda actualizada
    leyenda.remove();
    leyenda = L.control.Legend({
        position: "bottomright", // Posición de la leyenda en el mapa
        collapsed: false, // Si la leyenda está colapsada por defecto
        opacity: 1, // Opacidad de la leyenda
        legends: visibleLegends // Leyendas visibles actualizadas
    }).addTo(map);
}

// Eventos de los checkboxes para mostrar/ocultar capas

// Evento para mostrar/ocultar el municipio de Ocampo
document.getElementById("toggleMunicipioDeOcampo").addEventListener("change", function () {
    if (this.checked) {
        if (!map.hasLayer(municipio_ocampo)) {
            map.addLayer(municipio_ocampo);
        }
    } else {
        if (map.hasLayer(municipio_ocampo)) {
            map.removeLayer(municipio_ocampo);
        }
    }
    actualizarLeyenda();
});



// Evento para mostrar/ocultar los municipios colindantes
document.getElementById("toggleMunicipios").addEventListener("change", function () {
    if (this.checked) {
        if (!map.hasLayer(municipios_pob_tot)) {
            map.addLayer(municipios_pob_tot);
        }
    } else {
        if (map.hasLayer(municipios_pob_tot)) {
            map.removeLayer(municipios_pob_tot);
        }
    }
    actualizarLeyenda();
});

// Evento para mostrar/ocultar los municipios colindantes
document.getElementById("toggleNucleos").addEventListener("change", function () {
    if (this.checked) {
        if (!map.hasLayer(nucleos_pob_tot)) {
            map.addLayer(nucleos_pob_tot);
        }
    } else {
        if (map.hasLayer(nucleos_pob_tot)) {
            map.removeLayer(nucleos_pob_tot);
        }
    }
    actualizarLeyenda();
});

// Evento para mostrar/ocultar las localidades
document.getElementById("toggleLocalidades").addEventListener("change", function () {
    if (this.checked) {
        if (!map.hasLayer(localidades)) {
            map.addLayer(localidades);
        }
    } else {
        if (map.hasLayer(localidades)) {
            map.removeLayer(localidades);
        }
    }
    actualizarLeyenda();
});

// Evento para mostrar/ocultar las corrientes de agua
document.getElementById("toggleCorrientesDeAgua").addEventListener("change", function () {
    if (this.checked) {
        if (!map.hasLayer(corrientes_agua)) {
            map.addLayer(corrientes_agua);
        }
    } else {
        if (map.hasLayer(corrientes_agua)) {
            map.removeLayer(corrientes_agua);
        }
    }
    actualizarLeyenda();
});

// Evento para mostrar/ocultar zonas de incendios
document.getElementById("toggleZonasAfectadasIncendios").addEventListener("change", function () {
    if (this.checked) {
        // Si el cluster no está en el mapa, añadirlo
        if (!map.hasLayer(zonas_afec_in)) {
            map.addLayer(zonas_afec_in);
        }
    } else {
        // Si el cluster está en el mapa, eliminarlo
        if (map.hasLayer(zonas_afec_in)) {
            map.removeLayer(zonas_afec_in);
        }
    }
    actualizarLeyenda();
});

// Actualizar la leyenda al cargar la página
window.onload = function () {
    // Comprobar el estado de los checkboxes y añadir/quitar capas en consecuencia
    if (document.getElementById("toggleMunicipioDeOcampo").checked) {
        if (!map.hasLayer(municipio_ocampo)) {
            map.addLayer(municipio_ocampo);
        }
    } else {
        if (map.hasLayer(municipio_ocampo)) {
            map.removeLayer(municipio_ocampo);
        }
    }

    if (document.getElementById("toggleMunicipios").checked) {
        if (!map.hasLayer(municipios_pob_tot)) {
            map.addLayer(municipios_pob_tot);
        }
    } else {
        if (map.hasLayer(municipios_pob_tot)) {
            map.removeLayer(municipios_pob_tot);
        }
    }

     if (document.getElementById("toggleNucleos").checked) {
        if (!map.hasLayer(nucleos_pob_tot)) {
            map.addLayer(nucleos_pob_tot);
        }
    } else {
        if (map.hasLayer(nucleos_pob_tot)) {
            map.removeLayer(nucleos_pob_tot);
        }
    }

    if (document.getElementById("toggleLocalidades").checked) {
        if (!map.hasLayer(localidades)) {
            map.addLayer(localidades);
        }
    } else {
        if (map.hasLayer(localidades)) {
            map.removeLayer(localidades);
        }
    }

if (document.getElementById("toggleCorrientesDeAgua").checked) {
        if (!map.hasLayer(corrientes_agua)) {
            map.addLayer(corrientes_agua);
        }
    } else {
        if (map.hasLayer(corrientes_agua)) {
            map.removeLayer(corrientes_agua);
        }
    }

     if (document.getElementById("toggleZonasAfectadasIncendios").checked) {
        if (!map.hasLayer(zonas_afec_in)) {
            map.addLayer(zonas_afec_in);
        }
    } else {
        if (map.hasLayer(zonas_afec_in)) {
            map.removeLayer(zonas_afec_in);
        }
    }

    actualizarLeyenda(); // Actualizar la leyenda después de ajustar las capas visibles

}

// Diccionario de Mapas Base
var baseMaps = {
    "Google Maps Calles": googleStreets, // Capa de Google Maps Calles
    "Google Maps Satélite": googleSat, // Capa de Google Maps Satélite
    "Google Topo Map": OpenTopoMap, // Capa de OpenTopoMap 
};

// Diccionario de Capas
var layers = {};

// Agregar un control de localización (GPS)
L.control.locate({
    position: "topright", // Posición del control de localización
    strings: {
        title: "Mostrar mi ubicación" // Texto del título del control
    },
    locateOptions: {
        maxZoom: 10 // Nivel de zoom máximo para la localización
    }
}).addTo(map);

// Agregar el mini mapa
/*new L.Control.MiniMap(googleStreets, {
    toggleDisplay: true, // Opción para mostrar/ocultar el mini mapa
    minimized: true, // El mini mapa está minimizado por defecto
    position: "bottomleft" // Posición del mini mapa en la esquina inferior izquierda
}).addTo(map);*/

// Agregar control de Geocodificación
L.Control.geocoder({
    position: "topleft", // Posición del control de geocodificación
    placeholder: "Buscar dirección...", // Texto del marcador de posición del control
    errorMessage: "No se encontraron resultados de su dirección" // Mensaje de error cuando no se encuentran resultados
}).addTo(map);

// Agregar control de Búsqueda de atributos de una capa GeoJSON (Search-Control)
var searchControl = new L.Control.Search({
    layer: municipios_pob_tot, // Capa sobre la que se realiza la búsqueda
    propertyName: "NOMGEO", // Nombre de la propiedad que se busca
    marker: false, // No añadir un marcador al encontrar una ubicación
    moveToLocation: function (latlng, title, map) {
        var zoom = map.getBoundsZoom(latlng.layer.getBounds());
        map.setView(latlng, zoom); // Mover el mapa a la ubicación encontrada
    }
});

searchControl.on('search:locationfound', function (e) {
    e.layer.setStyle({
        fillColor: '#3f0', // Color de relleno al encontrar la ubicación
        color: '#0f0', // Color del borde al encontrar la ubicación
        weight: 5 // Grosor del borde al encontrar la ubicación
    });
    if (e.layer._popup) {
        e.layer.openPopup(); // Abrir el popup de la capa si existe
    }
}).on('search:collapsed', function (e) {
    // Evento que se ejecuta cuando se colapsa el control de búsqueda
    municipios_pob_tot.eachLayer(function (layer) {
        municipios_pob_tot.resetStyle(layer); // Restablecer el estilo de la capa de municipios colindantes
    });
});

map.addControl(searchControl);

// Añadir Sidebar
var sidebar = L.control.sidebar({
    position: "left", // Posición del sidebar en el mapa
    autopan: false, // Deshabilitar el auto paneo del mapa al abrir el sidebar
    container: "sidebar", // Contenedor del sidebar
}).addTo(map);

// Agregar el control de coordenadas
L.control.coordinates({
    position: "bottomright", // Posición del control de coordenadas en el mapa
    decimals: 2, // Cantidad de decimales para las coordenadas
    decimalSeparator: ".", // Separador decimal
    labelTemplateLat: "Latitud: {y}", // Plantilla de etiqueta para la latitud
    labelTemplateLng: "Longitud: {x}", // Plantilla de etiqueta para la longitud
    useLatLngOrder: true, // Usar el orden Latitud-Longitud
    enableUserInput: true // Permitir la entrada del usuario
}).addTo(map);

// Agregar Control de Escala
L.control.scale({
    imperial: false, // Deshabilitar la escala imperial
    position: "bottomright" // Posición del control de escala en el mapa
}).addTo(map);

// Añadir Control de Capas
L.control.layers(baseMaps, layers).addTo(map);

// Añadir Leyenda
var leyenda = L.control.Legend({
    position: "bottomright", // Posición de la leyenda en el mapa
    collapsed: false, // Si la leyenda está colapsada por defecto
    opacity: 1, // Opacidad de la leyenda
    legends: [] // Array de leyendas
}).addTo(map);

// Obtener el div del Home por su ID
var homeDiv = document.getElementById('homeButton');

// Añadir un evento click al div del Home para centrar el mapa
homeDiv.addEventListener('click', function() {
    map.setView([19.57110, -100.333650], 12); // Coordenadas del municipio de Ocampo y nivel de zoom
});
