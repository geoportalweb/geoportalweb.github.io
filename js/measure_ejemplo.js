(function (factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === "function" && define.amd) {
        define(["leaflet"], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === "object") {
        module.exports = factory(require("leaflet"));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== "undefined" && window.L) {
        factory(L);
    }
})(function (L) {
    L.Measure = {
        linearMeasurement: "Medir Distancia",
        areaMeasurement: "Medir Área",
        start: "0",
        meter: "m",
        meterDecimals: 0,
        kilometer: "km",
        kilometerDecimals: 2,
        squareMeter: "m²",
        squareMeterDecimals: 0,
        squareKilometers: "km²",
        squareKilometersDecimals: 2,
        hectares: "ha",
        hectaresDecimals: 2
    };

    L.Control.Measure = L.Control.extend({
        options: {
            position: "topright",
            border: "none",
            collapsed: false,
            color: "#FF0080",
        },
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            this._map = map;
            this._container || this._initLayout();
            return this._container;
        },
        _buildContainer: function () {
            this._container = L.DomUtil.create("div", "leaflet-control-measure leaflet-bar leaflet-control");

            this._contents = L.DomUtil.create("div", "leaflet-measure-contents", this._container);

            this._link = L.DomUtil.create("a", "leaflet-measure-toggle", this._container);
            this._link.title = this.options.title || "Measurement";
            this._link.href = "#";

            if (this.options.title) {
                var title = L.DomUtil.create("h3", "", this._contents);
                title.innerText = this.options.title;
            }

            this._buildItems();
        },
        _buildItems: function () {
            var ele_ul = L.DomUtil.create("ul", "leaflet-measure-actions", this._contents);
            var ele_li = L.DomUtil.create("li", "leaflet-measure-action", ele_ul);
            var ele_link_line = L.DomUtil.create("a", "start", ele_li);
            ele_link_line.innerText = L.Measure.linearMeasurement;
            ele_link_line.href = "#";
            L.DomEvent.disableClickPropagation(ele_link_line);
            L.DomEvent.on(ele_link_line, "click", this._enableMeasureLine, this);

            ele_li = L.DomUtil.create("li", "leaflet-measure-action", ele_ul);
            var ele_link_area = L.DomUtil.create("a", "leaflet-measure-action start", ele_li);
            ele_link_area.innerText = L.Measure.areaMeasurement;
            ele_link_area.href = "#";
            L.DomEvent.disableClickPropagation(ele_link_area);
            L.DomEvent.on(ele_link_area, "click", this._enableMeasureArea, this);
        },
        _initLayout: function () {
            this._buildContainer();
            L.DomEvent.disableClickPropagation(this._container);
            L.DomEvent.disableScrollPropagation(this._container);
            if (this.options.collapsed) {
                L.DomEvent.on(
                    this._container,
                    {
                        mouseenter: this._expand,
                        mouseleave: this._collapse,
                    },
                    this
                );
            } else {
                this._expand();
            }
        },
        _enableMeasureLine: function (ev) {
            L.DomEvent.stopPropagation(ev);
            L.DomEvent.preventDefault(ev);
            this._measureHandler = new L.MeasureAction(this._map, {
                model: "distance",
                color: this.options.color,
            });
            this._measureHandler.enable();
        },
        _enableMeasureArea: function (ev) {
            L.DomEvent.stopPropagation(ev);
            L.DomEvent.preventDefault(ev);
            this._measureHandler = new L.MeasureAction(this._map, {
                model: "area",
                color: this.options.color,
            });
            this._measureHandler.enable();
        },
        _expand: function () {
            this._link.style.display = "none";
            L.DomUtil.addClass(this._container, "leaflet-measure-expanded");
            return this;
        },
        _collapse: function () {
            this._link.style.display = "block";
            L.DomUtil.removeClass(this._container, "leaflet-measure-expanded");
            return this;
        },
    });

    L.control.measure = function (options) {
        return new L.Control.Measure(options);
    };

    L.MeasureLable = L.Layer.extend({
        options: {
            offset: new L.Point(0, 30),
            latlng: null,
            content: "",
            className: "",
        },
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            this._map = map;
            this._container || this._initLayout();
            map._panes.popupPane.appendChild(this._container);
            map.on("viewreset", this._updatePosition, this);
            if (L.Browser.any3d) {
                map.on("zoomanim", this._zoomAnimation, this);
            }
            this._update();
        },
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },
        onRemove: function (map) {
            map._panes.popupPane.removeChild(this._container);
            map.off(
                {
                    viewreset: this._updatePosition,
                    zoomanim: this._zoomAnimation,
                },
                this
            );
            this._map = null;
        },
        setLatLng: function (latlng) {
            this.options.latlng = L.latLng(latlng);
            this._updatePosition();
            return this;
        },
        setContent: function (content) {
            this.options.content = content;
            this._updateContent();
            return this;
        },
        _initLayout: function () {
            this._container = L.DomUtil.create("div", this.options.className);
            this._contentNode = L.DomUtil.create("div", "content", this._container);
        },
        _update: function () {
            this._map && (this._updateContent(), this._updatePosition());
        },
        _updateContent: function () {
            if (this.options.content) {
                if (typeof this.options.content == "string") {
                    this._contentNode.innerHTML = this.options.content;
                } else {
                    this._contentNode.innerHTML = "";
                    this._contentNode.appendChild(this.options.content);
                }
            }
        },
        _updatePosition: function () {
            var point = this._map.latLngToLayerPoint(this.options.latlng),
                is3D = L.Browser.any3d,
                offset = this.options.offset;
            is3D && L.DomUtil.setPosition(this._container, point);
            this._containerBottom = -offset.y - (is3D ? 0 : point.y);
            this._containerLeft = offset.x + (is3D ? 0 : point.x);
            this._container.style.bottom = this._containerBottom + "px";
            this._container.style.left = this._containerLeft + "px";
        },
        _zoomAnimation: function (a) {
            a = this._map._latLngToNewLayerPoint(this.options.latlng, a.zoom, a.center);
            L.DomUtil.setPosition(this._container, a);
        },
        enableClose: function () {
            this._closeButton = L.DomUtil.create("span", "close", this._container);
            this._closeButton.innerHTML =
                '<svg class="icon" viewBox="0 0 40 40"><path stroke="#FF0000" stroke-width="3" d="M 10,10 L 30,30 M 30,10 L 10,30" /></svg>';
            return this._closeButton;
        },
    });

    L.MeasureAction = L.Handler.extend({
        options: {
            color: "#FF0080",
            model: "distance", // area or distance
        },

        initialize: function (map, options) {
            this._map = map;
            this._map._measureHandler = this;
            L.Util.setOptions(this, options);
        },
        setModel: function (model) {
            this.options.model = model;
            return this;
        },
        addHooks: function () {
            this._activeMeasure();
        },
        removeHooks: function () {},
        _activeMeasure: function () {
            this._map._measureHandler._measurementStarted && this._map._measureHandler._finishMeasure();
            this._measurementStarted ? this._finishMeasure() : this._enableMeasure();
        },
        _onMouseClick: function (event) {
            var latlng = event.latlng || this._map.mouseEventToLatLng(event);
            if (this._lastPoint && latlng.equals(this._lastPoint)) {
                return;
            }
            if (this._trail.points.length > 0) {
                var points = this._trail.points;
                points.push(latlng);
                var length = points.length;
                this._totalDistance += this._getDistance(points[length - 1], points[length - 2]);
                if (this.options.model === "area") {
                    this._area += this._calculateArea(points[length - 2], points[length - 1]);
                }
            }
            this._lastPoint = latlng;
            this._trail.points.push(latlng);
            this._drawTrail(latlng);
        },
        _finishMeasure: function () {
            this._measurementStarted = false;
            this._trail &&
                (this._map.removeLayer(this._trail.polyline),
                this._map.removeLayer(this._trail.lable),
                this._trail.layer.closePopup(),
                this._trail.layer.clearLayers(),
                this._trail.layer.remove(),
                (this._trail = null));
            this._map.off("click", this._onMouseClick, this);
            L.DomUtil.removeClass(this._map._container, "measure-map");
            L.DomUtil.removeClass(document.body, "measure-map");
        },
        _enableMeasure: function () {
            this._measurementStarted = true;
            this._totalDistance = 0;
            this._area = 0;
            var trail = L.layerGroup().addTo(this._map);
            var points = [];
            this._trail = {
                layer: trail,
                polyline: L.polyline(points, {
                    weight: 2,
                    color: this.options.color,
                }).addTo(trail),
                lable: new L.MeasureLable({
                    className: "leaflet-measure-lable",
                    content: "",
                    latlng: this._map.getCenter(),
                }).addTo(this._map),
                points: points,
            };
            L.DomUtil.addClass(this._map._container, "measure-map");
            L.DomUtil.addClass(document.body, "measure-map");
            this._map.on("click", this._onMouseClick, this);
        },
        _drawTrail: function (latlng) {
            var points = this._trail.points;
            var latLngs = points.map(function (point) {
                return [point.lat, point.lng];
            });
            var distance = this._formatDistance(this._totalDistance);
            var area = this.options.model === "area" ? this._formatArea(this._area) : null;

            if (points.length < 2) {
                this._trail.lable.setContent(distance);
                this._trail.lable.setLatLng(latlng);
                return;
            }
            this._trail.polyline.setLatLngs(latLngs);
            var tooltipContent = distance;
            if (area) {
                tooltipContent += `<br>${area}`;
            }
            this._trail.lable.setContent(tooltipContent);
            this._trail.lable.setLatLng(latlng);
        },
        _getDistance: function (latlng1, latlng2) {
            var R = 6378137; // Earth’s mean radius in meter
            var dLat = this._deg2rad(latlng2.lat - latlng1.lat);
            var dLng = this._deg2rad(latlng2.lng - latlng1.lng);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this._deg2rad(latlng1.lat)) * Math.cos(this._deg2rad(latlng2.lat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d; // returns the distance in meter
        },
        _calculateArea: function (latlng1, latlng2) {
            // Placeholder for area calculation. You can implement more sophisticated methods based on your requirements.
            return this._getDistance(latlng1, latlng2);
        },
        _deg2rad: function (deg) {
            return deg * (Math.PI / 180);
        },
        _formatDistance: function (meters) {
            var kilometers = (meters / 1000).toFixed(L.Measure.kilometerDecimals);
            meters = meters.toFixed(L.Measure.meterDecimals);
            return meters + " " + L.Measure.meter + " / " + kilometers + " " + L.Measure.kilometer;
        },
        _formatArea: function (squareMeters) {
            var hectares = (squareMeters / 10000).toFixed(L.Measure.hectaresDecimals);
            var squareKilometers = (squareMeters / 1000000).toFixed(L.Measure.squareKilometersDecimals);
            squareMeters = squareMeters.toFixed(L.Measure.squareMeterDecimals);
            return squareMeters + " " + L.Measure.squareMeter + " / " + hectares + " " + L.Measure.hectares + " / " + squareKilometers + " " + L.Measure.squareKilometers;
        },
    });
});
