#Tolmey README

`Tolmey` is a little library for getting mapping images
from latitdue and longitudes.

It works for mapping systems using the EPSG:3857 or 
"Spherical Mercator" coordinate system.

This is the coordinate system used by
most online mapping applications (OpenStreetMap, Google Maps, and a
few others). The means that you can convert from a latitude and
longitude to a map tile URL, to download or do whatever you want with.

The code for transforming the coordinates was heavily inspired by the
[FoxtrotGPS](http://foxtrotgps.org) code for doing so.

##Installation

Tolmey uses [Ender](http://ender.no.de), a client-side library manager.
Follow the instructions on the website for installing ender, and then
navigate to the directory where you keep your javascript files.

Install Tolmey from NPM:

    ender build tolmey

This produces an ender.js file, which includes the Tolmey library. Then
add the `ender.js` file to your project like you would any other
Javascript file.

Or, if you already have an `ender.js` file, run:

    ender add path/to/Tolmey

##Usage Examples

###Getting X and Y Tile Coordinates From Latitude And Longitude:

    var Tolmey = require('tolmey');
    var converter = new Tolmey();
    var lat = 40.6789;
    var long = -111.6879;
    //need a zoom level as well. Higher numbers zoom in more.
    var zoom = 15.0;
    var tile_coordinates = converter.getMercatorFromGPS(lat, long, zoom);
    // { x: 6217, y: 12324 }

###Getting A URL for an OpenStreetMap Tile:

    var url = converter.getTileURL(openstreetmap', tile_coordinates.x, tile_coordinates.y,zoom);
    // "http://tile.openstreetmap.org/15/6217/12324.png"

##Example App

There is a small skeleton HTML page along with some javascript that
demonstrates how you could use Tolmey.

To build it, run `ender build jeesh path/to/tolmey`, and then open the
index.html file in a browser.

##Tolmey and Google Maps
I used FoxtrotGPS and OpenStreetMap to build this, but Google Maps
apprears to use a very similar coordinate system and URL scheme, so
Tolmey might be useful for obtaining URLs to Google Map tiles as well.

Feel free to bug me if you want more info on this.

##Why the name Tolmey?
"Tolmey" is my horrible misspelling of [Ptolemy](http://en.wikipedia.org/wiki/Ptolemy),
a famous Roman scientist. Among many other things, he was a famous
cartographer and mapper.
