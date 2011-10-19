#Tolmey README

`Tolmey` is a little library for getting mapping images
from latitdue and longitudes.

Currently its main function is to convert latitude and
longitude coordinates into a coordinate system used by
[OpenStreetMap](http://openstreetmap.org), and turn the resulting
coordinates into a URL for downloading that tile.

The code for transforming the coordinates was heavily inspired by the
[FoxtrotGPS](http://foxtrotgps.org) code for doing so.

##Usage Examples

Getting X and Y Tile Coordinates From Latitude And Longitude:

    var converter = new Tolmey();
    var lat = 40.6789;
    var long = -111.6879;
    //need a zoom level as well. Higher numbers zoom in more.
    var zoom = 15.0;
    var tile_coordinates = converter.getMercatorFromGPS(lat, long, zoom);
    // { x: 6217, y: 12324 }

Getting A URL for an OpenStreetMap Tile:

    var url = converter.getTileURL(openstreetmap', tile_coordinates.x, tile_coordinates.y,zoom);
    // "http://tile.openstreetmap.org/15/6217/12324.png"

##Why the name Tolmey?
"Tolmey" my horrible misspelling of [Ptolemy](http://en.wikipedia.org/wiki/Ptolemy),
a famous Roman scientist. Among many other things, he was a famous
cartographer and mapper.
