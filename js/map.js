// Function to draw your map
var map;
var drawMap = function() {

  // Create map and set view
  map = L.map('container', {scrollWheelZoom: false}).setView([38.883, -100.016], 4); //default to america

  // Create a tile layer variable using the appropriate url
  var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

  // Add the layer to your map
  layer.addTo(map);

  // Execute your function to get data
  getData();
}

// Function for getting data
var getData = function() {

  // Execute an AJAX request to get the data in data/response.js
  // When your request is successful, call your customBuild function
  var data;
  $.ajax({
    url: "./data/response.json",
    success: function(data) {
      customBuild(data);
    },
    type: "get",
    dataType: "json"
  });

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	// Be sure to add each layer to the map
  var unknown = new L.LayerGroup([]);
  var white = new L.LayerGroup([]);
  var black = new L.LayerGroup([]);
  var asian = new L.LayerGroup([]);
  var americanIndian = new L.LayerGroup([]);
  var islander = new L.LayerGroup([]);

  var killCount = {white: 0, other: 0};
  var hitCount = {white: 0, other: 0};

	// Once layers are on the map, add a leaflet controller that shows/hides layers

  data.map(function(item) {
    
    var race = item.Race;
    var isKilled = item['Hit or Killed?'];
    var options;

    if (isKilled == "Killed") {
     options = {color: "#ff0000", fill: "true"};

       if (race == "White") {
         killCount.white++;
       } else {
         killCount.other++;
       }
    } else {
     options = {color: "black"};

     if (race == "White") {
       hitCount.white++;
     } else {
       hitCount.other++;
     }
   }

    var circle = new L.circleMarker([item.lat, item.lng], options);
    circle.setRadius(7);

     if (race != "Unknown") {
       if (race == "White") {
        circle.addTo(white);
      } else if (race == "Black or African American") {
        circle.addTo(black);
      } else if (race == "Asian") {
        circle.addTo(asian);
      } else if (race == "American Indian or Alaska Native") {
        circle.addTo(americanIndian);
      } else {
        circle.addTo(islander);
      }
    } else {
      circle.addTo(unknown);
    }

    var hoverText = "";
    if (item.Summary != "undefined") {
      hoverText += item.Summary;
    } else {
      hoverText += "No summary available!";
    }

    circle.bindPopup(hoverText);

  });

  unknown.addTo(map);
  white.addTo(map);
  black.addTo(map);
  asian.addTo(map);
  americanIndian.addTo(map);
  islander.addTo(map);

  L.control.layers(null,{"Unknown": unknown, "White": white, "African American": black, "Asian": asian, "American Indian": americanIndian, "Pacific Islander": islander}).addTo(map);

  var makeTable = function() {
    $("#whiteKilled").text(killCount.white);
    $("#whiteHit").text(hitCount.white);
    $("#otherKilled").text(killCount.other);
    $("#otherHit").text(hitCount.other);
  }

  makeTable();
}
