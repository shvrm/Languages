'use strict';
var countryLanguageJSON = require('./Language.json');
var offices = require('./mbxLanguages.json');


mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYXMiLCJhIjoiUFdJckNoOCJ9.LGJOlhJCLddj5fk5da6ZjQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramas/cik4w4xqx006cbtj7rggrc81o', //stylesheet location
    center: [77.6, 12.98], // starting position
    zoom: 0, // starting zoom
    hash: true
});


var countries = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': countryLanguageJSON
});

var mbxoffices = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': offices
});

//what to do while loading map style
map.on('style.load', function () {
    map.addSource('countries', countries);
    map.addSource('offices', mbxoffices);
     //add countries layer to map
    map.addLayer({
        'id': 'countriesLayer',
        'type': 'fill',
        'source': 'countries',
        'layout': {
            visibility: 'visible'
        },
        'paint': {
            // 'fill-color': black
        }
    });

    //add office points

    map.addLayer({
        'id': 'officeLayerHalo',
        'type': 'circle',
        'source': 'offices',
        'interactive': true,
        'layout': {
            visibility: 'visible'
        },
        'paint': {
            'circle-radius': 15,
            'circle-color': 'red'
        }
    });

     // halo around office points

    map.addLayer({
        'id': 'officeLayer',
        'type': 'circle',
        'source': 'offices',
        'interactive': true,
        'layout': {
            visibility: 'visible'
        },
        'paint': {
            'circle-radius': 10,
            'circle-color': 'white'
        }
    });

});


map.on('click', function (e) {
    var countryFilter = []; //matching countries

    map.featuresAt(e.point, {
        radius: 10,
        layer: ['officeLayer', 'officeLayerHalo'],
        includeGeometry: true},  function (err, features) {
            if (err) throw err;

            if (features.length > 0) {
                if (features[0].properties.language) {
                    // Loops through languages at the office
                    for (var i = 0; i <  features[0].properties.language.length ; i++) {
                        console.log(features[0].properties.language.length);
                        console.log(countryLanguageJSON.features.length);

                                    //loop through country list
                        for (var j = 0; j < countryLanguageJSON.features.length; j++) {
                            var countryLanguages; //variable for languages of a country
                            console.log(countryLanguageJSON.features[j].properties.NAME);

                            if (countryLanguageJSON.features[j].properties.LANGUAGE) {
                                //if language is not null
                                //split the multiple languages
                                countryLanguages = countryLanguageJSON.features[j].properties.LANGUAGE.split(',');
                            }

                            if (countryLanguages) {
                                //for each language in the country list iterate
                                for (var k = 0; k < countryLanguages.length; k++) {
                                    console.log(features[0].properties.language[i]);
                                    if (features[0].properties.language[i] === countryLanguages[k]) {
                                        countryFilter.push(countryLanguageJSON.features[j].properties.ISO3);
                                    }
                                }
                            }
                        }
                    }
                }
                console.log(JSON.stringify(countryFilter));


                var filter = ['in', 'ISO3'].concat(countryFilter); //construct the filter here
                console.log(filter);
                console.log(map.setFilter('countriesLayer', filter)); //set the filter for the countries
                map.setPaintProperty('countriesLayer', 'fill-color', '#7AC4B8');
                console.log(map.getFilter('countriesLayer'));
            }

        });

});

