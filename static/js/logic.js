// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function () {

    // Create map
    var map = L.map('map').setView([0, 0], 2);
  
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Fetch earthquake data
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
      .then(response => response.json())
      .then(data => {
        // Add markers
        data.features.forEach(feature => {
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
          var lon = feature.geometry.coordinates[0];
          var lat = feature.geometry.coordinates[1];
  
          // Adjust marker size based on magnitude
          var radius = Math.sqrt(magnitude) * 3.5; // Adjust the factor as needed
  
          // Adjust marker color based on depth
          var color;
          if (depth < 30) {
            color = 'green'; // Shallow earthquakes
          } else if (depth < 70) {
            color = 'yellow'; // Intermediate earthquakes
          } else {
            color = 'red'; // Deep earthquakes
          }
  
          // Create marker
          var marker = L.circleMarker([lat, lon], {
            radius: radius,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
          }).addTo(map);
  
          // Create popup
          marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
        });
      });
  
    // Add legend
    var legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<strong style="color: black;">Legend</strong><br>'; // Set Legend title color to black
    div.innerHTML += '<div class="legend-chart">' +
    '<div class="legend-item"><div class="legend-square" style="background: green;"></div> Shallow earthquakes (depth < 30 km)</div>' +
    '<div class="legend-item"><div class="legend-square" style="background: yellow;"></div> Intermediate earthquakes (30 km <= depth < 70 km)</div>' +
    '<div class="legend-item"><div class="legend-square" style="background: red;"></div> Deep earthquakes (depth >= 70 km)</div>' +
    '</div>';
    return div;
    };
    legend.addTo(map);
  
    // Enable default Leaflet controls (zoom in/out buttons and map dragging)
    L.control.zoom({ position: 'topright' }).addTo(map);
  
});