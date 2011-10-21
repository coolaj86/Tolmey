(function () {
  "use strict";
  var Tolmey = require('tolmey');
  function displayMapTileForCoordinates(event) {
    event.preventDefault();
    var zoom = parseInt($(this).find("#zoom").val(), 10),
      converter = new Tolmey();

    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude,
        long = position.coords.longitude;
      var tile_coordinates = converter.getMercatorFromGPS(lat, long, zoom);
      var url = converter.getTileURL("openstreetmap", tile_coordinates.x, tile_coordinates.y, zoom);
      $("img#map_result").attr("src", url);
    });
  }

  $.domReady(function () {
    $("body").delegate("form", "submit", displayMapTileForCoordinates);
  });
}());
