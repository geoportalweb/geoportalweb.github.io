// Crear estilo simple para líneas (red_hidrica)
var corrientes_agua_styles = {
    color: "#00FFFB",   // Color de la línea
    weight: 1,          // Grosor de la línea
    opacity: 0.5,       // Opacidad de la línea
    dashArray: "10,5 "  // Patrón de guiones de la línea
};

// Función para definir el estilo de líneas según la propiedad del GeoJSON Rasgo_Prin Red Hídrica
function rasgo_principal_rh_style(feature) {
    // Evaluar la propiedad 'CONDICION' de la característica (feature)
    switch(feature.properties.CONDICION) {
        case "PERENNE":
            return {
                color: "#02F9C8",   // Color para ríos perennes
                weight: 1,          // Grosor de la línea
                opacity: 1,         // Opacidad de la línea
                dashArray: "10,5 "  // Patrón de guiones de la línea
            };

        case "INTERMITENTE":
            return {
                color: "#02B6F9",   // Color para ríos intermitentes
                weight: 1,          // Grosor de la línea
                opacity: 1          // Opacidad de la línea
            };

        /* 
        // Ejemplos comentados para otros tipos de ríos y quebradas
        case "Río Seco":
            return {
                color: "#brown",    // Color para ríos secos
                weight: 1.5,        // Grosor de la línea
                opacity: 1          // Opacidad de la línea
            };

        case "Quebrada Húmeda":
            return {
                color: "red",       // Color para quebradas húmedas
                weight: 1.5,        // Grosor de la línea
                opacity: 1,         // Opacidad de la línea
                dashArray: "5, 5, 1"// Patrón de guiones de la línea
            };

        case "Quebrada Seca":
            return {
                color: "orange",    // Color para quebradas secas
                weight: 1.5,        // Grosor de la línea
                opacity: 1,         // Opacidad de la línea
                dashArray: "5, 5, 1"// Patrón de guiones de la línea
            };
        */
    }
}

// Crear estilo simple para polígonos (departamentos_poblacion)
/* 
var limite_departamental_style = {
    color: "yellow",      // Color del borde del polígono
    opacity: 0.5,         // Opacidad del borde
    weight: 1,            // Grosor del borde
    // dashArray: "10, 10",  // Patrón de guiones del borde (comentado)
    fillOpacity: 0.1      // Opacidad del relleno
}; 
*/

// Función para obtener colores basados en el valor de población
function obtenerColorPob2015(NOMGEO) {
    // Aquí podrías definir la lógica para asignar colores según el nombre del municipio
    return "#ffffd4"; // Ejemplo de color de relleno, ajusta según tus necesidades
}

// Función para cargar el estilo basado en la población de 2015
function cargarStylePob2015(feature) {
    return {
        fillColor: obtenerColorPob2015(feature.properties.NOM_MUN), // Color de relleno basado en la población
        fillOpacity: 0.3,   // Opacidad del relleno
        weight: 1,          // Grosor del borde
        color: "yellow",    // Color del borde
        opacity: 0.5,       // Opacidad del borde
        dashArray: ""       // Sin patrón de guiones
    };
}
