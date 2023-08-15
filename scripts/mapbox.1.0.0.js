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
var renderLocationOnMap = function () {
    var _this = this;
    console.log("renderLocation", this);
    var cms_item = this;
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
};
window.onload = function () {
    var initialLocations = document.querySelectorAll(".location");
    initialLocations.forEach(function (initialLocation) {
        renderLocationOnMap.call(initialLocation);
    });
    var observer = new MutationObserver(function (mutationList) {
        for (var _i = 0, mutationList_1 = mutationList; _i < mutationList_1.length; _i++) {
            var mutation = mutationList_1[_i];
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                var addedNodes = Array.prototype.slice.call(mutation.addedNodes);
                var removedNodes = Array.prototype.slice.call(mutation.removedNodes);
                addedNodes.forEach(function (addedNode) {
                    console.log("Parent added node", addedNode.parentElement);
                    if (addedNode.parentElement.classList.contains("list-item")) {
                        console.log("Added node", addedNode);
                        renderLocationOnMap.call(addedNode);
                    }
                });
                removedNodes.forEach(function (removedNode) {
                    console.log("Parent removed node", removedNode.parentElement);
                    if (removedNode.parentElement.classList.contains("list-item")) {
                        console.log("Removed node", removedNode);
                        removedNode.marker.remove();
                    }
                });
            }
        }
    });
    var locationsWrapper = document.getElementById("list-wrapper");
    observer.observe(locationsWrapper, { childList: true });
};
