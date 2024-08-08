// Crear una función popup para el GeoJSON Restos Arqueológicos
function popupRestosArqueologicos(feature, layer) {
    // Verificar si la propiedad 'NOM_LOC' existe en 'feature.properties'
    if (feature.properties && feature.properties.NOM_LOC) {
        // Vincular un popup al layer con el nombre de la localidad
        layer.bindPopup("<b>Localidad: </b>" + feature.properties.NOM_LOC);
    }
}

// Crear una función popup para el GeoJSON Pasivos Ambientales Mineros
function popupPasivosAmbientalesMineros(feature, layer) {
    // Verificar si las propiedades 'PASIVO' y 'CLASE' existen en 'feature.properties'
    if (feature.properties && feature.properties.NOMBRE_DEL && feature.properties.MOTIVO_DEL) {
        // Vincular un popup al layer con la información del pasivo y su clase
        layer.bindPopup("<b>NOMBRE: </b>" + feature.properties.NOMBRE_DEL +
                        "<br><b>MOTIVO: </b>" + feature.properties.MOTIVO_DEL);
    }
}

// Crear una función popup para el GeoJSON Red Hídrica
function popupRedHidrica(feature, layer) {
    // Verificar si las propiedades 'Nombre', 'Rasgo_Prin' y 'Rasgo_Secu' existen en 'feature.properties'
    if (feature.properties && feature.properties.Nombre && feature.properties.Rasgo_Prin && feature.properties.Rasgo_Secu) {
        // Vincular un popup al layer con la información del nombre, rasgo principal y rasgo secundario
        layer.bindPopup("<b>Nombre: </b>" + feature.properties.Nombre +
                        "<br><b>Rasgo Principal: </b>" + feature.properties.Rasgo_Prin +
                        "<br><b>Rasgo Secundario: </b>" + feature.properties.Rasgo_Secu);
    }
}

// Crear una función popup para el GeoJSON Departamentos (limite_departamental)
function popupLimiteDepartamental(feature, layer) {
    // Crear una ruta para la imagen del departamento usando el nombre del municipio
    var ruta_img_dpto = '<img src ="images/departamentos_poblacion/' + feature.properties.NOM_MUN + '.jpg" class="popup-img-dpto">';
    
    // Verificar si las propiedades 'CVE_MUN' y 'NOM_MUN' existen en 'feature.properties'
    if (feature.properties && feature.properties.CVE_MUN && feature.properties.NOM_MUN) {
        // Crear el contenido del popup con la clave del municipio y el nombre del municipio
        var popupContent = "<b>Clave: </b>" + feature.properties.CVE_MUN +
                           "<br><b>Municipio: </b>" + feature.properties.NOM_MUN +
                           "<br><br>" + ruta_img_dpto;
        
        // Vincular un popup al layer con el contenido del popup
        layer.bindPopup(popupContent);
    }
}
