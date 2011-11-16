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
  });

  describe('translate', function() {
    it('should give a correct lat and lon', function () {
      expect(t.translate(40, 111, 1500, 0).latitude).toBeWithin({ expected: 40.0134, range: 0.0001 });
    });
  });
});
