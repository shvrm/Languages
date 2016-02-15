'use strict';
var countryLanguageJSON = require('./countryLanguages.json');
var offices = require('./mbxLanguages.json');
var blurbHeader;
var blurbCount;
var blurbAddress;

mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYXMiLCJhIjoiUFdJckNoOCJ9.LGJOlhJCLddj5fk5da6ZjQ';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramas/cikmcynsj00c5b5lwqzvvlk1r', //stylesheet location
    center: [27.33, 27.73], // starting position
    minZoom: 1.8, //set zoom level
    maxZoom: 1.8 
    
});


//disable paning and other interactions

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
    },'country-label-lg'); //place country labels above the countries layer

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
                        
                        //loop through country list
                        for (var j = 0; j < countryLanguageJSON.features.length; j++) {
                           
                            var countryLanguages =[]; //variable for languages of a country
                            if (countryLanguageJSON.features[j].properties.LANGUAGE) { //if language is not null
                                
                                //split the multiple languages
                                countryLanguages = countryLanguageJSON.features[j].properties.LANGUAGE.split(',');

                            }

                            if (countryLanguages) {
                               

                                 //for each language in the country list iterate
                                for (var k = 0; k < countryLanguages.length; k++) {
                                    

                                    if (features[0].properties.language[i] === countryLanguages[k].trim()) {
                                        //push the country name ot the filter list only if it is already not present in the list
                                        
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
                onHover();
               
             }
                var generalInfoDiv = document.getElementById("generalInfo");
                var officeInfodiv= document.getElementById("officeInfo");
                map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
               
                if (err || !features.length) {
                noHover(); //set the style to default colors
                
           
                generalInfoDiv.style.display = "block";
                officeInfodiv.style.display="none";
                return;
                }
                else {
                onHover(); // highlight the matching countries

                officeInfodiv.style.display = "block";
                
                
                generateInfo(features[0], countryFilter);
                
             }

        });


});


function onHover() // highlights the matching countries when there is a mouse over on any of the office
{
    map.setPaintProperty('countriesLayer','fill-color','#f2e190');
    map.setPaintProperty('countriesLayer','fill-opacity','1');
    map.setPaintProperty('countriesLayer','fill-outline-color','#fefaff');
}

function noHover() //set the map style to defaults if there is no mouse over on any of the office
{
   map.setPaintProperty('countriesLayer','fill-color','#ffffff');
   map.setPaintProperty('countriesLayer','fill-opacity','0');
   map.setPaintProperty('countriesLayer','fill-outline-color','#ffffff');
}

function generateInfo(office, countryMatch) //generates information for the office on the fly

{
      var generalInfoDiv = document.getElementById("generalInfo");
      generalInfoDiv.style.display ="none";
      var officeInfoDiv = document.getElementById("officeInfo");
      officeInfoDiv.innerHTML="";
      var infoHeading = document.createElement('h1');
      blurbHeader = office.properties.name;
      infoHeading.innerHTML = blurbHeader;
      officeInfoDiv.appendChild(infoHeading);
      var addressText = document.createElement('p');
      blurbAddress =office.properties.housenumber+" "+ office.properties.street+"</br>"+
                    office.properties.area+"</br>"+
                    office.properties.city+"</br>"+
                    office.properties.country;
      addressText.innerHTML= blurbAddress;
      officeInfoDiv.appendChild(addressText);
      var countText = document.createElement('p');
      blurbCount ="At our "+ office.properties.name +
                   " office, we speak  " +office.properties.language.length+
                  " language(s) that are official to "+ countryMatch.length+" countries.";
      countText.innerHTML=blurbCount;
      officeInfoDiv.appendChild(countText);
      
      
 }




