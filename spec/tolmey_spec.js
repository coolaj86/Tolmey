var Tolmey = require('tolmey');
var t = new Tolmey();

describe('Tolmey', function () {
  describe('distanceInMeters', function () {
    it('calculates the correct distance in meters between two points', function () {
      expect(t.distanceInMeters(40, 111, 40.0135, 111)).toBeWithin({ expected: 1500, range: 10 });
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

  // describe('distanceInMeters', function () {
  //   it('returns the approximate distance in meters between to gps coordinates', function () {
  //     expect(t.getPointDistanceAwayInDirection(1500, "North"));
  //   });
  // });
});

