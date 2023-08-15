mapboxgl.accessToken =
    "pk.eyJ1IjoiYnlhbmltYSIsImEiOiJjbGt3eTQxMXUwNXlrM3FueTVkYTUyZmwwIn0.ZUthdqyjpaM2LxlZtUfSaw";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/byanima/clkx0n1rk005z01qsdmyd9v0l",
    center: [-3.1910909, 55.9519327],
    zoom: 12.5,
});
map.addControl(new mapboxgl.NavigationControl());
var active_popup, active_marker, active_item;
$(".location").each(function (index) {
    var _this = this;
    var cms_item = $(this);
    var lat = cms_item.find(".lat").text();
    var lon = cms_item.find(".lon").text();
    var item_popup = this.popup;
    var marker_el = document.createElement("div");
    var item_category = cms_item.find(".location-category").text();
    marker_el.classList.add("marker");
    marker_el.classList.add("marker-".concat(item_category.toLowerCase()));
    var popup_html = cms_item.find(".pre-popup")[0].outerHTML;
    item_popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "auto",
    }).setHTML(popup_html);
    var mark = this.marker;
    mark = new mapboxgl.Marker(marker_el)
        .setLngLat([lon, lat])
        .setPopup(item_popup)
        .addTo(map);
    var updateActiveItem = function (scrollIntoView) {
        if (active_marker != undefined) {
            active_item.classList.remove("active");
            active_popup.remove();
        }
        item_popup.addTo(map);
        active_popup = item_popup;
        active_marker = marker_el;
        active_item = _this;
        active_item.classList.add("active");
        map.flyTo({
            center: [lon, lat],
            essential: true,
            zoom: map.getZoom(),
        });
        if (scrollIntoView) {
            active_item.scrollIntoViewIfNeeded({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
            });
        }
    };
    marker_el.addEventListener("click", function () {
        var scrollIntoView = true;
        updateActiveItem(scrollIntoView);
    });
    this.addEventListener("click", function () {
        updateActiveItem();
    });
    item_popup.on("close", function () {
        active_item.classList.remove("active");
        active_marker = undefined;
    });
});
