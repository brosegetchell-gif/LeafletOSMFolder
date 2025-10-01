var map = L.map('weathermap').setView([38, -95], 4);
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
}).addTo(map);

var basemap = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
).addTo(map);

var earthquakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function magColor(m) {
  return m >= 6 ? '#800026' :
         m >= 5 ? '#BD0026' :
         m >= 4 ? '#E31A1C' :
         m >= 3 ? '#FC4E2A' :
         m >= 2 ? '#FD8D3C' :
         m >= 1 ? '#FEB24C' : '#FFEDA0';
}

function magRadius(m) {
  if (!Number.isFinite(m) || m <= 0) return 3;
  return 3 + m * 3;
}

$.getJSON(earthquakesUrl, function(data) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      var m = feature.properties && feature.properties.mag;
      return {
        radius: magRadius(m),
        fillColor: magColor(m),
        color: '#333',
        weight: 0.75,
        opacity: 1,
        fillOpacity: 0.75
      };
    },
    onEachFeature: function(feature, layer) {
      var p = feature.properties || {};
      var mag = Number.isFinite(p.mag) ? p.mag.toFixed(1) : 'N/A';
      var place = p.place || 'Unknown location';
      var time = p.time ? new Date(p.time).toLocaleString() : 'Unknown time';
      layer.bindPopup('<b>M ' + mag + '</b><br>' + place + '<br>' + time);
    }
  }).addTo(map);

});
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + magColor(grades[i] + 0.01) + '"></i> ' +
      (grades[i + 1] ? grades[i] + '–' + grades[i + 1] + '<br>' : grades[i] + '+');
  }
  return div;
};

legend.addTo(map);

