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
var markers = [];
var renderMap = function () {
    markers.forEach(function (marker) { return marker.remove(); });
    markers = [];
    $(".location").each(function (index) {
        var _this = this;
        var cmsItem = $(this);
        var lat = cmsItem.find(".lat").text();
        var lon = cmsItem.find(".lon").text();
        var item_popup = this.popup;
        var item_marker = document.createElement("div");
        var item_category = cmsItem.find(".location-category").text();
        item_marker.classList.add("marker");
        item_marker.classList.add("marker-".concat(item_category.toLowerCase()));
        var body = cmsItem.find(".pre-popup");
        item_popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            maxWidth: "auto",
        }).setHTML(body[0].outerHTML);
        var mark = this.marker;
        mark = new mapboxgl.Marker(item_marker)
            .setLngLat([lon, lat])
            .setPopup(item_popup)
            .addTo(map);
        markers.push(mark);
        item_marker.addEventListener("click", function () {
            item_popup.addTo(map);
            if (active_marker != undefined) {
                active_item.classList.remove("active");
                item_popup.remove();
            }
            active_item = _this;
            active_item.classList.add("active");
            active_item.scrollIntoViewIfNeeded({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
            });
            active_marker = item_marker;
            map.flyTo({
                center: [lon, lat],
                essential: true,
            });
        });
        this.addEventListener("click", function () {
            map.flyTo({
                center: [lon, lat],
                essential: true,
            });
            if (active_marker != undefined) {
                active_item.classList.remove("active");
                active_marker.classList.remove("show");
                active_popup.remove();
            }
            item_popup.addTo(map);
            item_marker.classList.add("show");
            active_marker = item_marker;
            active_popup = item_popup;
            active_item = _this;
            active_item.classList.add("active");
        });
    });
};
renderMap();
var listWrapper = document.getElementById("list-wrapper");
var observer = new MutationObserver(function (mutationsList) {
    for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
        var mutation = mutationsList_1[_i];
        if (mutation.type === "childList") {
            renderMap();
        }
    }
});
observer.observe(listWrapper, { childList: true });
