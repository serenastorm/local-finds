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
let markers = []; // Array to store created markers

const renderMap = () => {
  markers.forEach((marker) => marker.remove());
  markers = []; // Clear the markers array

  $(".location").each(function (index) {
    let cmsItem = $(this);
    let lat = cmsItem.find(".lat").text();
    let lon = cmsItem.find(".lon").text();
    let item_popup = this.popup;

    let item_marker = document.createElement("div");
    let item_category = cmsItem.find(".location-category").text();
    item_marker.classList.add("marker");
    item_marker.classList.add(`marker-${item_category.toLowerCase()}`);
    let body = cmsItem.find(".pre-popup");

    item_popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      maxWidth: "auto",
    }).setHTML(body[0].outerHTML);

    let mark = this.marker;
    mark = new mapboxgl.Marker(item_marker)
      .setLngLat([lon, lat])
      .setPopup(item_popup)
      .addTo(map);

    markers.push(mark);

    // MARKERS EVENT

    item_marker.addEventListener("click", () => {
      item_popup.addTo(map); // show popup
      if (active_marker != undefined) {
        active_item.classList.remove("active");
        item_popup.remove(); // remove the previous active popup if it's existing
      }
      active_item = this;
      active_item.classList.add("active");
      active_item.scrollIntoViewIfNeeded({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      active_marker = item_marker; // set the current popup active
      map.flyTo({
        center: [lon, lat],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    });

    // LIST ITEMS EVENT

    this.addEventListener("click", () => {
      map.flyTo({
        center: [lon, lat],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });

      if (active_marker != undefined) {
        active_item.classList.remove("active");
        active_marker.classList.remove("show"); // we also come back to the original marker's image for the previous active marker
        active_popup.remove(); // remove the previous active popup if it's existing
      }
      item_popup.addTo(map); // toggle popup open or closed
      item_marker.classList.add("show");
      active_marker = item_marker;
      active_popup = item_popup;
      active_item = this;
      active_item.classList.add("active");
    });

    // Map event (user clicks the map and closes the popup)
    // Basically tracks changes to active_popup

    // item_popup.on("close", () => {
    //   active_item.classList.remove("active");
    //   active_marker = undefined;
    // });
  });
};

// Initial rendering
renderMap();

// Observe changes in the #list-wrapper
const listWrapper = document.getElementById("list-wrapper");

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // List items have changed, re-render the map
      renderMap();
    }
  }
});

observer.observe(listWrapper, { childList: true });
