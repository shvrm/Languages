var countries = require('./Language.json');
// var offices = require('./mbxoffices.json');

mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYXMiLCJhIjoiUFdJckNoOCJ9.LGJOlhJCLddj5fk5da6ZjQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramas/cik4w4xqx006cbtj7rggrc81o', //stylesheet location
    center: [77.6, 12.98], // starting position
    zoom: 0, // starting zoom
    hash: true
});


var countries = new mapboxgl.GeoJSONSource({
     "type": "geojson",
    "data": countries
});

var mbxoffices = new mapboxgl.GeoJSONSource({
     "type": "geojson",
    "data": offices
});

map.on('style.load', function () {
    map.addSource("countries", countries);

    map.addLayer({
        "id": "countriesLayer",
        "type": "Polygon",
        "source": countries
		// "interactive":true,
    });
		//
		//     map.addLayer({
		//         "id": "officesLayer",
		//         "type": "Point",
		//         "source": offices
		// // "interactive":true,
		//     });
	
	map.on("click", function(e) {
	    map.featuresAt(e.point, {
	        radius: 25,
	        layer: "original"
	    }, function (err, features) {
	        if (features.length !== 0) {
	            map.setFilter(countries, ["==", "LANGUAGE", "ARA"]
)
	        }
	    });
	});
});

