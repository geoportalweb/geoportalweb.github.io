// Variables globales para almacenar las capas de shapefile, KML y GPX
var shapefileLayer; // Variable para almacenar la capa shapefile
var kmlLayer; // Variable para almacenar la capa KML
var gpxLayer; // Variable para almacenar la capa GPX

// Función para manejar la selección de archivos
function handleFileSelect(event) {
    var input = document.getElementById('fileInput'); // Obtiene el elemento de entrada de archivo
    var file = input.files[0]; // Obtiene el primer archivo seleccionado

    if (file) {
        var fileType = file.name.split('.').pop().toLowerCase(); // Obtiene la extensión del archivo y la convierte a minúsculas
        var reader = new FileReader(); // Crea una nueva instancia de FileReader

        reader.onload = function(event) {
            var data = event.target.result; // Obtiene el contenido del archivo
            // Verifica el tipo de archivo y llama a la función correspondiente
            if (fileType === 'kml') {
                handleKML(data); // Llama a la función para manejar archivos KML
            } else if (fileType === 'zip') {
                handleShapefile(data); // Llama a la función para manejar archivos shapefile
            } else if (fileType === 'gpx') {
                handleGPX(data); // Llama a la función para manejar archivos GPX
            } else {
                alert('Por favor selecciona un archivo KML, GPX o un archivo shapefile en formato ZIP.'); // Muestra una alerta si el archivo no es válido
            }
        };

        // Lee el contenido del archivo basado en su tipo
        if (fileType === 'kml') {
            reader.readAsText(file); // Lee el archivo KML como texto
        } else if (fileType === 'zip') {
            reader.readAsArrayBuffer(file); // Lee el archivo shapefile (ZIP) como ArrayBuffer
        } else if (fileType === 'gpx') {
            reader.readAsText(file); // Lee el archivo GPX como texto
        }
    } else {
        alert('Por favor selecciona un archivo KML, GPX o shapefile en formato ZIP.'); // Muestra una alerta si no se selecciona ningún archivo
    }
}

// Función para manejar la carga de archivos KML
function handleKML(data) {
    if (kmlLayer) {
        map.removeLayer(kmlLayer); // Elimina la capa KML existente del mapa si existe
    }
    kmlLayer = omnivore.kml.parse(data); // Analiza el archivo KML y crea una capa
    kmlLayer.addTo(map); // Añade la capa KML al mapa
    map.fitBounds(kmlLayer.getBounds()); // Ajusta los límites del mapa para mostrar la capa KML
}

// Función para convertir y manejar archivos shapefile
function handleShapefile(data) {
    shp(data).then(function(geojson) {
        addShapefileLayerToMap(geojson); // Convierte el shapefile a GeoJSON y lo añade al mapa
    });
}

// Función para añadir la capa shapefile al mapa
function addShapefileLayerToMap(geojson) {
    if (shapefileLayer) {
        map.removeLayer(shapefileLayer); // Elimina la capa shapefile existente del mapa si existe
    }
    shapefileLayer = L.geoJSON(geojson, {
        onEachFeature: function(feature, layer) {
            var popupContent = formatPopupContent(feature.properties); // Formatea el contenido del popup para cada entidad
            layer.bindPopup(popupContent); // Añade un popup a cada entidad
        }
    }).addTo(map); // Añade la capa GeoJSON al mapa
    map.fitBounds(shapefileLayer.getBounds()); // Ajusta los límites del mapa para mostrar la capa shapefile
}

// Función para formatear el contenido del popup
function formatPopupContent(properties) {
    return Object.entries(properties)
        .map(function(entry) {
            return '<b>' + entry[0] + ':</b> ' + entry[1]; // Formatea cada propiedad como una cadena HTML
        })
        .join('<br>'); // Une todas las propiedades con un salto de línea
}

// Función para manejar la carga de archivos GPX
function handleGPX(data) {
    if (gpxLayer) {
        map.removeLayer(gpxLayer); // Elimina la capa GPX existente del mapa si existe
    }
    gpxLayer = new L.GPX(data, {
        async: true, // Carga asincrónica del archivo GPX
        marker_options: {
            startIconUrl: 'images/pin-icon-start.png', // URL del icono de inicio
            endIconUrl: 'images/pin-icon-end.png', // URL del icono de fin
            shadowUrl: 'images/pin-shadow.png' // URL de la sombra del icono
        }
    }).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds()); // Ajusta los límites del mapa para mostrar la capa GPX
    }).addTo(map); // Añade la capa GPX al mapa
}

// Función para borrar las capas del mapa
function clearShapefile() {
    if (shapefileLayer) {
        map.removeLayer(shapefileLayer); // Elimina la capa shapefile del mapa
        shapefileLayer = null; // Resetea la variable shapefileLayer a null
    }
    if (kmlLayer) {
        map.removeLayer(kmlLayer); // Elimina la capa KML del mapa
        kmlLayer = null; // Resetea la variable kmlLayer a null
    }
    if (gpxLayer) {
        map.removeLayer(gpxLayer); // Elimina la capa GPX del mapa
        gpxLayer = null; // Resetea la variable gpxLayer a null
    }
}

// Asigna los eventos a los elementos del DOM
document.getElementById('fileInput').addEventListener('change', handleFileSelect); // Asigna la función handleFileSelect al evento change del input de archivo
document.getElementById('clear-button').addEventListener('click', clearShapefile); // Asigna la función clearShapefile al evento click del botón de borrar shapefile
