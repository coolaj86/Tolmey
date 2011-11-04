(function () {
  "use strict";
  require("Array.prototype.forEachAsync");
  var Tolmey = require('tolmey'),
    Tar = require('tar'),
    toDataURL = require('toDataURL'),
    ahr = require("ahr2"),
    forEachAsync = require("forEachAsync"),
    converter = new Tolmey(),
    Join = require('join'),
    EventEmitter = require('events.node').EventEmitter,
    imageEmitter = new EventEmitter(),
    progressBar;

  imageEmitter.on("image_downloaded", imageWasDownloaded);


  function imageWasDownloaded (progress) {
    progressBar.width('' + progress + '%');
  }

  function displayMapTileForCoordinates (event) {
    event.preventDefault();
    var zoom = parseInt($(this).find("#zoom").val(), 10);
      // tar = new Tar();
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude,
        long = position.coords.longitude,
        tile_coordinates = converter.getMercatorFromGPS(lat, long, zoom),
        url;
      url = converter.getTileURL("google", tile_coordinates.x, tile_coordinates.y, zoom);
      $("img#map_result").attr("src", url);
    });
  }

  function downloadTar (event) {
    event.preventDefault();
    var lat = parseInt($(this).find("#lat").val(), 10),
      lon = parseInt($(this).find("#lon").val(), 10),
      radiusInMeters = parseInt($(this).find("#rad").val(), 10),
      tar = new Tar(),
      urls,
      requests = [],
      join = Join(),
      numberOfTilesDownloaded = 0,
      numberOfTiles = 0,
      tilesAddedToTar = 0;

    urls = converter.getTileURLs({
      lat: lat,
      lon: lon,
      radius: radiusInMeters,
      mappingSystem: "google",
      zoom: 15,
      maxZoom: 17
    });

    urls.forEach(function (url) { numberOfTiles += url.length });
    if (numberOfTiles === 0) {
      alert("Nothing found for this lat and lon. Try a different one.");
    }

    urls.forEach(function (urlArray) {
      urlArray.forEach(function (urlObject) {
        //Callback Soup Served Fresh From Our Kitchens!®
        // join.add() returns a callback, and registers an event with join.when so it knows
        // to wait until the callback is called.
        // We call our callback inside the arh.get.when() callback, because we know that
        // the data is all downloaded then.
        var callback = join.add();
        ahr.get(urlObject.url, {}, { overrideResponseType: 'binary' }).when(function (err, ahr, data) {
          callback(err, ahr, data, urlObject);
          numberOfTilesDownloaded += 1;
          var progress = parseInt((numberOfTilesDownloaded / numberOfTiles) * 100, 10);
          imageEmitter.emit('image_downloaded', progress);
        });
      });
    });

    join.when(function () {
      // Arguments are the arguments for each callback function wrapped
      // up in an array.
      var args = Array.prototype.slice.call(arguments, 0)
      args.forEach(function (arg) {
        addToTar(arg[0], arg[1], arg[2], arg[3], tar);
        tilesAddedToTar += 1;
      });

      downloadInBrowser(toDataURL, tar);
    });
  }

  function downloadInBrowser(dataURLCreator, tar) {
    var dataURL = dataURLCreator.toDataURL(tar.out, "application/octet-stream", false);
    window.open(dataURL, "_self");
  }

  function addToTar (error, response, data, urlObject, tar) {
    if (error || typeof(data) === "undefined" || response.browserRequest.status != 200) {
      console.log("error: " + error);
      console.log("response: " + response);
      return;
    }
    var buff = new Uint8Array(data, 0, data.byteLength);
    tar.append("tiles/" + tileCoordinatesToFilePath(urlObject.coords), buff);
  }

  function tileCoordinatesToFilePath(tileCoordinates) {
    return "" + tileCoordinates.zoom + "/" + tileCoordinates.x + "/" + tileCoordinates.y + ".jpg";
  }


  $.domReady( function () {
    progressBar = $("#bar-inner");

    $("body").delegate("form#constant_zoom", "submit", displayMapTileForCoordinates);
    $("body").delegate("form#get_tar", "submit", downloadTar);
  });
}());
