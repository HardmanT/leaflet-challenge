// Event Listener
document.addEventListener('DOMContentLoaded', function () {

    // Map
    var map = L.map('map').setView([0, 0], 2);
  
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Earthquake data
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
      .then(response => response.json())
      .then(data => {
        // Markers
        data.features.forEach(feature => {
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
          var lon = feature.geometry.coordinates[0];
          var lat = feature.geometry.coordinates[1];
  
          // Marker size based on magnitude
          var radius = Math.sqrt(magnitude) * 3.5;
  
          // Marker color based on depth
          var color;
          if (depth < 30) {
            color = 'green';
          } else if (depth < 70) {
            color = 'yellow';
          } else {
            color = 'red';
          }
  
          // Marker
          var marker = L.circleMarker([lat, lon], {
            radius: radius,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
          }).addTo(map);
  
          // Popup
          marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
        });
      });
  
    // Legend
    var legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<strong style="color: black;">Legend</strong><br>';
    div.innerHTML += '<div class="legend-chart">' +
    '<div class="legend-item"><div class="legend-square" style="background: green;"></div> Shallow earthquakes (depth < 30 km)</div>' +
    '<div class="legend-item"><div class="legend-square" style="background: yellow;"></div> Intermediate earthquakes (30 km <= depth < 70 km)</div>' +
    '<div class="legend-item"><div class="legend-square" style="background: red;"></div> Deep earthquakes (depth >= 70 km)</div>' +
    '</div>';
    return div;
    };
    legend.addTo(map);
  
    // Default Leaflet controls (zoom in/out buttons and map dragging)
    L.control.zoom({ position: 'topright' }).addTo(map);
  
});