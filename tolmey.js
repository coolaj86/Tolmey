// (C) Jamison Dance (jergason) 2011
// MIT License

(function() {
  "use strict";

  function Tolmey() {
    this.RADIUS_OF_EARTH_IN_METERS = 6378100;
    this.TILESIZE = 256;
  }

  //Returns the central angle between two points in latiude and longitude
  Tolmey.prototype.haversineFunction = function (lat_start, long_start, lat_end, long_end) {
    var dLat = this.degreesToRadians(lat_end - lat_start),
      dLon = this.degreesToRadians(long_end - long_start),
      lat1 = this.degreesToRadians(lat_start),
      lat2 = this.degreesToRadians(lat_end);

    var a = Math.pow(Math.sin(dLat/2), 2) + Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(dLon/2),2);
    var centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return centralAngle;
  };


  Tolmey.prototype.distanceInMeters = function (lat_start, long_start, lat_end, long_end) {
    var central_angle_in_radians = this.haversineFunction(lat_start, long_start, lat_end, long_end);
    return central_angle_in_radians * this.RADIUS_OF_EARTH_IN_METERS;
  };

  Tolmey.prototype.getMercatorFromGPS = function (lat, lon, zoom) {
    var pixel_x = this.lonToXPixels(zoom, this.degreesToRadians(lon));
    var pixel_y = this.latToYPixels(zoom, this.degreesToRadians(lat));
    var max_pixel = Math.pow(2, zoom) * this.TILESIZE;

    if (pixel_x < 0) {
      pixel_x += max_pixel;
    }
    else if (pixel_x > max_pixel) {
      pixel_x -= max_pixel;
    }

    var tile_x = Math.floor(pixel_x / this.TILESIZE);
    var tile_y = Math.floor(pixel_y / this.TILESIZE);
    if (tile_x >= Math.pow(2, zoom)) {
      tile_x -= Math.pow(2, zoom);
    }

    return { x: tile_x, y: tile_y };
  };

  Tolmey.prototype.getTileURL = function(mapping_system, x, y, zoom) {
    if (mapping_system === "openstreetmap") {
       return "http://tile.openstreetmap.org/" +
        zoom + "/" + x + "/" +
          y + ".png";
    }
  };

  Tolmey.prototype.latToYPixels = function (zoom, lat) {
    var lat_m = this.atanh(Math.sin(lat));
    var pixel_y = -( (lat_m * this.TILESIZE * Math.exp(zoom * Math.log(2)) ) / (2 * Math.PI)) +
      (Math.exp(zoom * Math.log(2)) * (this.TILESIZE/2) );
    return Math.floor(pixel_y);
  };

  Tolmey.prototype.lonToXPixels = function (zoom, lon) {
    var pixel_x = ( (lon * this.TILESIZE * Math.exp(zoom * Math.log(2)) ) / (2*Math.PI) ) +
      ( Math.exp(zoom * Math.log(2)) * (this.TILESIZE/2) );
    return Math.floor(pixel_x);
  };

  Tolmey.prototype.getEarthRadiusAtZoomLevel = function (zoom_level) {
    //At each zoom level, it takes zoom_level^2 images to span the earth.
    //At zoom level 0, it takes 1 image to cover the earth, so the circumference is 1.
    var circumference = this.getCircumference(zoom_level);
    return circumference / (2 * Math.PI);
  };

  Tolmey.prototype.getCircumference = function (zoom_level) {
    var tiles = Math.pow(2, zoom_level);
    var circumference = tiles;
    return circumference;
  };

  Tolmey.prototype.xPixelToLon = function (zoom, xPixel) {
    var lon = ((xPixel - ( Math.exp(zoom * Math.log(2)) * (this.TILESIZE / 2))) * 2 * Math.PI) /
      (this.TILESIZE * Math.exp(zoom * Math.log(2)));
    return lon;
  };

  Tolmey.prototype.yPixelToLat = function (zoom, yPixel) {
    var latM = (-( yPixel - ( Math.exp(zoom * Math.log(2)) * (this.TILESIZE / 2))) * (2 * Math.PI)) /
      (this.TILESIZE * Math.exp(zoom * Math.log(2)));
    var lat = Math.atan(this.tanh(latM));
    return lat;
  };

  Tolmey.prototype.atanh  = function (x) {
    return 0.5 * Math.log((1 + x) / (1 - x));
  };

  Tolmey.prototype.tanh = function (x) {
    return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
  };

  Tolmey.prototype.degreesToRadians = function (degrees) {
    return (degrees * Math.PI) / 180;
  };

  Tolmey.prototype.radiansToDegrees = function (radians) {
    return (radians * 180) / Math.PI;
  };

  Tolmey.prototype.within = function (a, b, width) {
    return (Math.abs(a - b) < width);
  };

  module.exports = Tolmey;
}());
