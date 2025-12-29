// Crear ícono personalizado para la capa restos_arqueologicos
var restos_arqueologicos_icon = L.icon({
    iconUrl: "plugins/images/restos_arqueologicos.png", // URL de la imagen del ícono
    iconSize: [50, 50], // Tamaño del ícono
    icoAnchor: [25, 25], // Punto del ícono que estará anclado al punto del marcador
    popupAnchor: [0, -25] // Punto desde el cual se abrirá el popup
});

// Crear ícono personalizado para la capa localidades_ocampo
var localidades_ocampo_icon = L.icon({
    iconUrl: "plugins/images/restos_arqueologicos.png", // URL de la imagen del ícono
    iconSize: [15, 15], // Tamaño del ícono
    icoAnchor: [25, 25], // Punto del ícono que estará anclado al punto del marcador
    popupAnchor: [0, -15] // Punto desde el cual se abrirá el popup
});

// Crear ícono personalizado para la capa pasivos ambientales mineros abandonados
var pam_abandonado_icon = L.icon({
    iconUrl: "plugins/images/pam_abandonado.png", // URL de la imagen del ícono
    iconSize: [25, 25] // Tamaño del ícono
});

// Crear ícono personalizado para la capa pasivos ambientales mineros inactivo
var pam_inactivo_icon = L.icon({
    iconUrl: "plugins/images/pam_inactivo.png", // URL de la imagen del ícono
    iconSize: [25, 25] // Tamaño del ícono
});

// Función para obtener el ícono según categoría
function obtenerIconPam (feature){
    // Si la propiedad CVE_AGEB es "002-6", devolver el ícono de pam_abandonado
    if (feature.properties.MOTIVO_DEL === "Provocado"){
        return pam_abandonado_icon;
    // Si la propiedad CVE_AGEB es "001-1", devolver el ícono de pam_inactivo
    } else if (feature.properties.MOTIVO_DEL === "Actividades agropecuarias"){
        return pam_inactivo_icon;
    }
};

// Función para obtener el ícono según categoría (comentada)
/*function obtenerIconPam (feature){
    if (feature.properties.CLASE === "ABANDONADO"){
        return pam_abandonado_icon;
    } else if (feature.properties.CLASE === "INACTIVO"){
        return pam_inactivo_icon;
    }
};*/

// Función para añadir el ícono correcto a cada categoría del GeoJSON
function cargarIconPam(feature, layer){
    // Establecer el ícono de la capa según la función obtenerIconPam
    layer.setIcon(obtenerIconPam (feature));
};
