(function () {
  "use strict";
  require('Array.prototype.forEachAsync');
  var Tolmey = require('tolmey')
    , Futures = require('futures')
    , Tar = require('tar')
    , toDataURL = require('toDataURL')
    , ahr = require("ahr2")
    , converter = new Tolmey()
    , Join = require('join')
    , EventEmitter = require('events.node').EventEmitter
    , imageEmitter = new EventEmitter()
    , progressBar
    , dropshareURL = "http://dropshare.coolaj86.info"
    ;

  imageEmitter.on('image_downloaded', imageWasDownloaded);


  function imageWasDownloaded (progress) {
    progressBar.width('' + progress + '%');
  }

  function displayMapTileForCoordinates (event) {
    event.preventDefault();
    var zoom = parseInt($(this).find("#zoom").val(), 10);
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude
        , long = position.coords.longitude
        , tile_coordinates = converter.getMercatorFromGPS(lat, long, zoom)
        , url
        ;
      url = converter.getTileURL('google', tile_coordinates.x, tile_coordinates.y, zoom);
      $("img#map_result").attr("src", url);
    });
  }

  function addToSequence(sequence, url, tar) {
    sequence.then(function (next) {
      ahr.get(url.url, {}, { overrideResponseType: 'binary' }).when(function (err, ahr, data) {
        // numberOfTilesDownloaded += 1;
        // var progress = parseInt((numberOfTilesDownloaded / numberOfTiles) * 100, 10);
        addToTar(err, ahr, data, tar);
        next();
      });
    });
  }

  function downloadTar (event) {
    event.preventDefault();
    var lat = parseInt($(this).find("#lat").val(), 10)
      , lon = parseInt($(this).find("#lon").val(), 10)
      , radiusInMeters = parseInt($(this).find("#rad").val(), 10)
      , tar = new Tar()
      , urls
      , requests = []
      , join = Join()
      , numberOfTilesDownloaded = 0
      , numberOfTiles = 0
      , tilesAddedToTar = 0
      , sequence = Futures.sequence()
      , err
      , i
      , j
      ;

    urls = converter.getTileURLs({
      lat: lat,
      lon: lon,
      radius: radiusInMeters,
      mappingSystem: "google",
      zoom: 14,
      maxZoom: 19
    });

    urls.forEach(function (url) { numberOfTiles += url.length });
    if (numberOfTiles === 0) {
      alert("Nothing found for this lat and lon. Try a different one.");
    }

    urls.forEach(function (urlArray) {
      urlArray.forEach(function (urlObject) {
        sequence.then(function (next) {
          ahr.get(urlObject.url, {}, { overrideResponseType: 'binary' }).when(function (err, ahr, data) {
            numberOfTilesDownloaded += 1;
            var progress = parseInt((numberOfTilesDownloaded / numberOfTiles) * 100, 10);
            addToTar(err, ahr, data, urlObject, tar);
            imageEmitter.emit('image_downloaded', progress);
            next();
          });
        });
      });
    });

    sequence.then(function (next) {
      uploadToDropshare(tar, displayDownloadLink);
      next();
    });
  }

  function displayDownloadLink (id) {
    var link = "<a href='" + dropshareURL + "/files/" + id + "/images.tar'>Click Me To Download Tar!</a>";
    $("#download-links").append(link);
  }

  function uploadToDropshare (tar, cb) {
    var meta
      , date = new Date()
      ;
    meta = [{
      'size': tar.out.length,
      'type': 'application/x-tar',
      'fileName': 'images.tar',
      'lastModifiedDate': date.toISOString()
    }];

    //get the metadata
    ahr.post(dropshareURL + '/files/new', {}, meta).when(function (err, res, data) {
      var formData = new FormData();
      if (err || typeof(data) === "undefined") {
        throw new Error("can't get id from dropshare");
      }

      formData.append(data[0], tar.out);
      ahr.post(dropshareURL + '/files', {}, formData).when(function (err, res, data2) {
        if (err || typeof(data) === "undefined") {
          throw new Error("can't post the file to dropshare");
        }

        cb(data[0]);
      });
    });
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
