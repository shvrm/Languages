'use strict';
var countryLanguageJSON = require('./countryLanguages.json');
var offices = require('./mbxLanguages.json');
var blurbHeader = "Placeholder";
var blurbCount ="We speak a total of 24 languages that are official/co-official to 110 countries. Hover over our office locations to find out the global reach of our team based on our language repotoire."
var blurbNewOffice="Later this month we'll be opening up our fifth, and newest office in Berlin, Germany. This brings our team size to a total of xxx individuals."

mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYXMiLCJhIjoiUFdJckNoOCJ9.LGJOlhJCLddj5fk5da6ZjQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramas/cikmcynsj00c5b5lwqzvvlk1r', //stylesheet location
    center: [27.33, 27.73], // starting position
    minZoom: 1.8,
    maxZoom: 1.8 // starting zoom
    // hash: true
});

map.dragRotate.disable();
map.touchZoomRotate.disable();
map.touchZoomRotate.disableRotation();
map.dragPan.disable();

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
			'fill-color': '#ffffff',
			'fill-opacity': '.0',
			'fill-outline-color': '#ffffff'
        }
    },'country-label-lg');

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
            'circle-radius': 14,
            'circle-color': '#e62749',
            'circle-blur' : .9
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
            'circle-radius': 5,
            'circle-color': '#e62749',
            'circle-opacity': 0.9

        }
    });

});





map.on('mousemove', function (e) {
    console.log();

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
                                        if(countryFilter.indexOf(countryLanguageJSON.features[j].properties.ISO3) < 0 )
                                        {

                                            countryFilter.push(countryLanguageJSON.features[j].properties.ISO3);


                                        }
                                        
                                        
                                    }
                                }
                            }
                            
                        }
                    }
                }
                
                var filter = ['in', 'ISO3'].concat(countryFilter); //construct the filter here
                map.setFilter('countriesLayer', filter); //set the filter for the countries
                map.setPaintProperty('countriesLayer','fill-color','#f2e190');
                map.setPaintProperty('countriesLayer','fill-opacity','1');
                map.setPaintProperty('countriesLayer','fill-outline-color','#fefaff');
                

            
        
               
            }
                var hideDiv = document.getElementById("info1");
                var div= document.getElementById("info");
                map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
               
                if (err || !features.length) {
                map.setPaintProperty('countriesLayer','fill-color','#ffffff');
                map.setPaintProperty('countriesLayer','fill-opacity','0');
                map.setPaintProperty('countriesLayer','fill-outline-color','#ffffff');
           
                hideDiv.style.display = "block";
                div.style.display="none";
                return;
                }
                else {

                div.style.display = "block";
                blurbHeader = features[0].properties.name;
                map.setPaintProperty('countriesLayer','fill-color','#f2e190');
                map.setPaintProperty('countriesLayer','fill-opacity','1');
                map.setPaintProperty('countriesLayer','fill-outline-color','#fefaff');
                generateInfo(features[0], countryFilter);
                
             }

        });


});


function generateInfo(office, countryMatch)

 {
      var hideDiv = document.getElementById("info1");
      info1.style.display ="none";
      var div = document.getElementById("info");
      div.innerHTML="";
      var infoheading = document.createElement('h1');
      infoheading.innerHTML = blurbHeader;
      div.appendChild(infoheading);
      var firstParagraph = document.createElement('p');
      firstParagraph.innerHTML= office.properties.housenumber+" "+ 
                                office.properties.street+"</br>"+
                                office.properties.area+"</br>"+
                                office.properties.city+"</br>"+
                                office.properties.country;
      div.appendChild(firstParagraph);
      var secondParagraph = document.createElement('p');
      secondParagraph.innerHTML="At our "+ office.properties.name +
                                 " office, we speak  " +office.properties.language.length+
                                 " language(s) that are official to "+ countryMatch.length+" countries.";
      div.appendChild(secondParagraph);
      
      
 }




