// import $ from "jquery";
// import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnlhbmltYSIsImEiOiJjbGt3eTQxMXUwNXlrM3FueTVkYTUyZmwwIn0.ZUthdqyjpaM2LxlZtUfSaw";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/byanima/clkx0n1rk005z01qsdmyd9v0l",
  center: [-3.1910909, 55.9519327],
  zoom: 12.5,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var active_popup, active_marker, active_item;

$(".location").each(function (index) {
  let cms_item = $(this);
  let lat = cms_item.find(".lat").text();
  let lon = cms_item.find(".lon").text();
  let item_popup = this.popup;

  let marker_el = document.createElement("div");
  let item_category = cms_item.find(".location-category").text();
  marker_el.classList.add("marker");
  marker_el.classList.add(`marker-${item_category.toLowerCase()}`);
  let popup_html = cms_item.find(".pre-popup")[0].outerHTML;

  item_popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    maxWidth: "auto",
  }).setHTML(popup_html);

  let mark = this.marker;
  mark = new mapboxgl.Marker(marker_el)
    .setLngLat([lon, lat])
    .setPopup(item_popup)
    .addTo(map);

  const updateActiveItem = (scrollIntoView?: boolean) => {
    // Remove the previous active popup if it exists
    if (active_marker != undefined) {
      active_item.classList.remove("active");
      active_popup.remove();
    }

    item_popup.addTo(map);
    active_popup = item_popup;

    active_marker = marker_el;

    active_item = this;
    active_item.classList.add("active");

    map.flyTo({
      center: [lon, lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
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

  // Marker event
  marker_el.addEventListener("click", () => {
    const scrollIntoView = true;
    updateActiveItem(scrollIntoView);
  });

  // List item event
  this.addEventListener("click", () => {
    updateActiveItem();
  });

  // Map event (user clicks the map and closes the popup)
  // Basically tracks changes to active_popup
  item_popup.on("close", () => {
    active_item.classList.remove("active");
    active_marker = undefined;
  });
});
