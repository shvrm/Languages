'use strict';
var countryLanguageJSON = require('./Language.json');
var offices = require('./mbxLanguages.json');


mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYXMiLCJhIjoiUFdJckNoOCJ9.LGJOlhJCLddj5fk5da6ZjQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramas/cikmcynsj00c5b5lwqzvvlk1r', //stylesheet location
    // center: [77.6, 12.98], // starting position
    zoom: 1.5 // starting zoom
    // hash: true
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
            'circle-radius': 12,
            'circle-color': 'red',
            'circle-blur' : 0.5
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
            'circle-radius': 8,
            'circle-color': 'white',
            'circle-opacity': 0.9

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
                if (features[0].properties.language) { // if there is a language attribute for each office
                    // Loop through the language list of each office
                    for (var i = 0; i <  features[0].properties.language.length; i++) {
                    	// console.log("Verifying matches for "+features[0].properties.language[i]+"...");
                        //loop through country list
                        for (var j = 0; j < countryLanguageJSON.features.length; j++) {
                        	// console.log("Entering through the country list...");
                            var countryLanguages =[]; //variable for languages of a country
                            if (countryLanguageJSON.features[j].properties.LANGUAGE) { //if language is not null
                                
                                //split the multiple languages
                                countryLanguages = countryLanguageJSON.features[j].properties.LANGUAGE.split(',');

                            }

                            if (countryLanguages) {
                            	// console.log("List of languages for "+countryLanguageJSON.features[j].properties.NAME + " "+countryLanguages);

                            	 //for each language in the country list iterate
                                for (var k = 0; k < countryLanguages.length; k++) {
                                	// console.log("Testing whether "+ countryLanguages[k] + " is a match for " +features[0].properties.language[i] );
                                    if (features[0].properties.language[i] === countryLanguages[k].trim()) {
                                    	// console.log("Yes, found a match!");
                                        countryFilter.push(countryLanguageJSON.features[j].properties.ISO3);
                                    }
                                }
                            }
                            
                        }
                    }
                }
                console.log("A total of "+countryFilter.length+" matches found.");
                var filter = ['in', 'ISO3'].concat(countryFilter); //construct the filter here
                map.setFilter('countriesLayer', filter); //set the filter for the countries
                map.setPaintProperty('countriesLayer','fill-color','#7AC4B8');
 				map.setPaintProperty('countriesLayer','fill-opacity','0.5');
 				map.setPaintProperty('countriesLayer','fill-outline-color','#ffffff');

                
            }

        });
});



map.on('mousemove', function (e) {
    var countryFilter = []; //matching countries

    map.featuresAt(e.point, {
        radius: 10,
        layer: ['officeLayer', 'officeLayerHalo'],
        includeGeometry: true},  function (err, features) {
            if (err) throw err;

            if (features.length > 0) {
                if (features[0].properties.language) { // if there is a language attribute for each office
                    // Loop through the language list of each office
                    for (var i = 0; i <  features[0].properties.language.length; i++) {
                        // console.log("Verifying matches for "+features[0].properties.language[i]+"...");
                        //loop through country list
                        for (var j = 0; j < countryLanguageJSON.features.length; j++) {
                            // console.log("Entering through the country list...");
                            var countryLanguages =[]; //variable for languages of a country
                            if (countryLanguageJSON.features[j].properties.LANGUAGE) { //if language is not null
                                
                                //split the multiple languages
                                countryLanguages = countryLanguageJSON.features[j].properties.LANGUAGE.split(',');

                            }

                            if (countryLanguages) {
                                // console.log("List of languages for "+countryLanguageJSON.features[j].properties.NAME + " "+countryLanguages);

                                 //for each language in the country list iterate
                                for (var k = 0; k < countryLanguages.length; k++) {
                                    // console.log("Testing whether "+ countryLanguages[k] + " is a match for " +features[0].properties.language[i] );
                                    if (features[0].properties.language[i] === countryLanguages[k].trim()) {
                                        // console.log("Yes, found a match!");
                                        countryFilter.push(countryLanguageJSON.features[j].properties.ISO3);
                                    }
                                }
                            }
                            
                        }
                    }
                }
                console.log("A total of "+countryFilter.length+" matches found.");
                var filter = ['in', 'ISO3'].concat(countryFilter); //construct the filter here
                map.setFilter('countriesLayer', filter); //set the filter for the countries
                map.setPaintProperty('countriesLayer','fill-color','#7AC4B8');
                map.setPaintProperty('countriesLayer','fill-opacity','0.5');
                map.setPaintProperty('countriesLayer','fill-outline-color','#ffffff');

                
            }

        });
});





// map.on('click', function (e) {

   
//     map.featuresAt(e.point, {
//         radius: 10,
//         layer: ['officeLayer'],
//         includeGeometry: true
//             }, function (err, features) {
//                 if (err) throw err;

//                 if (features.length > 0) {

//                     var popupHTML = '<h5>' +  features[0].properties.name +'</h5>';

//                     var popup = new mapboxgl.Popup()
//                                 .setLngLat(features[0].geometry.coordinates)
//                                 .setHTML(popupHTML)
//                                 .addTo(map);

                       
//                             }
//                         });

// });


var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});
map.on('mousemove', function(e) {
    map.featuresAt(e.point, {
        radius: 7.5, // Half the marker size (15px).
        includeGeometry: true,
        layer: 'officeLayer'
    }, function(err, features) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
        if (err || !features.length) {
            popup.remove();
            return;
        }
        var feature = features[0];
        // Initialize a popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.name)
            .addTo(map);
    });
});















