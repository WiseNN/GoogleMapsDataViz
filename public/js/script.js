       var map, infoWindow, defaultCoords;
       var markers = [];

      
    

          
          
          
          
      

        
      function initMap() 
      {
          
          //get window location...
          if(navigator.geolocation)
      {
          //informational window
          infoWindow = new google.maps.InfoWindow;
          
          navigator.geolocation.getCurrentPosition(function(position){
              var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              
              defaultCoords = pos;
          
          infoWindow.setPosition(pos);
          infoWindow.setContent('Your Current Location');
          infoWindow.open(map);
          map.setCenter(pos);
          }, function(){
              handleLocationError(true, infoWindow, map.getCenter());
            });
          }
      else{
          //Browser does not support GeoLocation
          handleLocationError(false, infoWindow, map.getCenter());
          defaultCoords = {lat: -34.397, lng: 150.644}
      }
          
          
          
          //init map...
          debugger;
        map = new google.maps.Map(document.getElementById('mapContainer'), {
          center: defaultCoords,
          zoom: 13,
            mapTypeId: 'roadmap'
        });
          
          //fusion table layer
          var layer = new google.maps.FusionTablesLayer({
              query: {
                select: 'Type',
                from: '1FjVvT2lxm_meECyU7Mn1TaZOvvwu3rJnpZztPqvr',
//                where: 'ridership > 5000'
              }
            });
            layer.setMap(map);
      
      // Create the search box and link it to the UI element.
        var input = document.getElementById('addressTextField');
        var searchBox = new google.maps.places.SearchBox(input);
//        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
          
          
          
          
          // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            debugger;
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
              //icon for place NEEDS TO BE CHANGED
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(30, 30)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
//            map.setCenter(place.geometry.location);
        });
         
      
      }



























