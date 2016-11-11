    CTA Voronoi
===========

Generates Voronoi diagrams based on CTA station locations.

Before Running
--------------
The first thing you will need to do is run

    ant prebuild

That will move a copy of the relevant lodash and d3 files into the `src` directory

Next, you need to add a file `/src/amd/gmaps-api.key` that contains your Google Maps API key on a single line.
The app will fail if you do not.

Running locally
---------------
`cd`ing to `src` and running the node `http-server` will get you going immediately.