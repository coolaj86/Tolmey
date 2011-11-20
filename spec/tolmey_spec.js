var Tolmey = require('tolmey'),
  t = new Tolmey();

describe('Tolmey', function () {
  describe('distanceInMeters', function () {
    it('calculates the correct distance in meters between two points', function () {
      expect(t.distanceInMeters(40, 111, 40.0135, 111)).toBeWithin({ expected: 1500, range: 10 });
    });

    it('handles wrapping around the origin', function () {
      expect(t.distanceInMeters(179.999, 111, -179.999, 111)).toBeWithin({ expected: 222, range: 10 });
    });

  });

  describe('getMercatorFromGPS', function () {
    it('returns the X and Y coordinates for a GPS point at a zoom level', function () {
      expect(t.getMercatorFromGPS(40, -111, 15)).toEqual({ x: 6280, y: 12405 });
    });
  });

  describe('getTileURL', function () {
    it('should return the correct OpenStreetMap URL when given openstreetmap, an x, a y, and a zoom level', function () {
      expect(t.getTileURL('openstreetmap', 6280, 12405, 15)).toEqual("http://tile.openstreetmap.org/15/6280/12405.png");
    });
  });

  describe('getMetersPerPixel', function () {
    it('returns the correct number of meters per pixel', function () {
      expect(t.getMetersPerPixel(15, 44)).toBeCloseTo(3.43649, 4);
    });

    it('throws an error if the requested lat is outside the range', function () {
      expect(function () { t.getMetersPerPixel(15, 85.06) }).toThrow("Mercator projection is not valid outside of [-85.05, 85.05].");
      expect(function () { t.getMetersPerPixel(15, -85.06) }).toThrow("Mercator projection is not valid outside of [-85.05, 85.05].");
    });

    it ('defaults to a zoom level of 0 if zoom level is less than 0', function () {
      expect(t.getMetersPerPixel(-1, 44)).toBeCloseTo(t.getMetersPerPixel(0, 44), 10);
    });
  });

  describe('getTileURLs', function() {
    it('returns an array of URLs given valid arguments', function () {
      var results = t.getTileURLs({ mappingSystem: "openstreetmap", radius: 1500, lat: 40, lon: -111, zoom: 15 });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(function (urlsForZoomLevel) {
        urlsForZoomLevel.forEach(function (url) {
          expect(typeof(url.url)).toEqual("string");
        });
        if (urlsForZoomLevel.length > 0) {
          expect(urlsForZoomLevel.length).toBeGreaterThan(1);
        }
      });
    });

    it('returns an array of urls that contain the url for a tile at a specific point', function () {
      var lat = 40.75
        , lon = -111.883333
        , merc
        , goodUrl
        , contains = false;
        ;

      merc = t.getMercatorFromGPS(lat, lon, 18);
      goodUrl = t.getTileURL('google', merc.x, merc.y, 18);

      urls = t.getTileURLs({
        mappingSystem: 'google',
        radius: 500,
        lat: lat,
        lon: lon,
        zoom: 15
      });

      urls.forEach(function (zoomLevel, zoom) {
        zoomLevel.forEach(function (url, i) {
          if (url.url === goodUrl) {
            contains = true;
          }
        });
      });

      waits(1000);
      expect(contains).toBe(true);
    });
  });

  describe('translate', function() {
    it('gives a correct lat and lon for a point to the north', function () {
      var latlon = t.translate(40, 111, 1500, 0);
      expect(latlon.latitude).toBeWithin({ expected: 40.0134, range: 0.0001 });
      expect(latlon.longitude).toBeWithin({ expected: 111, range: 0.00001 });
    });

    it('gives a correct latitude and longitude for a point to the south', function () {
    });
  });
});
