#Tolmey README

`Tolmey` is a little library for getting mapping images
from latitdue and longitudes.

Currently its main function is to convert latitude and
longitude coordinates into a coordinate system used by
[OpenStreetMap](http://openstreetmap.org), and turn the resulting
coordinates into a URL for downloading that tile.

The code for transforming the coordinates was heavily inspired by the
[FoxtrotGPS](http://foxtrotgps.org) code for doing so.

##Installation

Tolmey uses [Ender](http://ender.no.de), a client-side library manager.
Follow the instructions on the website for installing ender, and then
navigate to the directory where you keep your javascript files.

Tolmey is not in the NPM package index yet, so the best way to install
it currently is to clone this repository somewhere.

    git clone git@github.com:jergason/Tolmey.git
    cd your/projects/javascript/folder
    ender build path/to/Tolmey

This produces an ender.js file, which includes the Tolmey library. Then
add the `ender.js` file to your project like you would any other
Javascript file.

Or, if you already have an ender file, run:

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

##Tolmey and Google Maps
I used FoxtrotGPS and OpenStreetMap to build this, but Google Maps
apprears to use a very similar coordinate system and URL scheme, so
Tolmey might be useful for obtaining URLs to Google Map tiles as well.

Feel free to bug me if you want more info on this.

##Why the name Tolmey?
"Tolmey" is my horrible misspelling of [Ptolemy](http://en.wikipedia.org/wiki/Ptolemy),
a famous Roman scientist. Among many other things, he was a famous
cartographer and mapper.
