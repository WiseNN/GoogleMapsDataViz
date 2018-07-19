       var map, panoStreetView, infoWindow, defaultCoords, fusionLayer;
       var markers = [];

        //google directions variabls
        var directionsDisplay, directionsService;
        
        //sample data, timer id
        var timerID;

      
    

          
          
          
      
        
      function createGoogleStreetView(forPos)
      {
          panoStreetView = new google.maps.StreetViewPanorama(
          document.getElementById('streetViewContainer'),{
              position: forPos,
              pov: {
                  heading: 34,
                  pitch: 10
              }
          });
          
          map.setStreetView(panoStreetView);
      }

        function retrieveRoute(startLoc, endLoc)
        {
            

            var request = {
                origin: startLoc,
                destination: endLoc,
                avoidHighways: false,
                avoidTolls: false, 
                provideRouteAlternatives: false,
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                region: 'us'
            };

            //Ask Google Directions Service to send a route back to us.
            directionsService.route(request, function(response, status){

                if(status == google.maps.DirectionsStatus.OK)
                {
                    //Now the route is drawn on the map
                    directionsDisplay.setDirections(response);
                }
            });

            window.clearTimeout(timerID);
        }


       
    
      function delayedCall()
      {
          timerID = window.setTimeout(function(){
              retrieveRoute("Charlotte, NC", "Fort Lauderdale, FL");
              createGoogleStreetView({lat: 33.754711, lng: -84.388068});
              
          }, 1000);
          
      }

    function createFusionTableLayer()
    {
        //fusion table layer
              var fusionLayer = new google.maps.FusionTablesLayer({
                  query: {
                    select: 'Type',
                    from: '1FjVvT2lxm_meECyU7Mn1TaZOvvwu3rJnpZztPqvr',
    //                where: 'ridership > 5000'
                  }
                });
                fusionLayer.setMap(map);
        
        google.maps.event.addListener(fusionLayer,'click', function(event){
//            alert("lat: "+event.latLng.lat()+" long: "+event.latLng.lng());
            if(markers.length > 0)
            {
                //get start location from address search field
                let startLoc = markers[0].position;

                //get end location from the map pin
                let endLoc = {
                              lat: event.latLng.lat(),
                              lng: event.latLng.lng() 
                             };

                retrieveRoute(startLoc,endLoc);
                createGoogleStreetView(endLoc);
            }
            
            
            
        });
        
    }

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
            mapTypeId: 'roadmap',
            mapTypeControl: true,

            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
                mapTypeIds: ['roadmap', 'terrain','satellite','hybrid']
                

            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            scaleControl: true,
            scaleControlOoptions:{
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            streetViewControl: false,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            fullscreenControl: true,
            rotateControl: true,
            rotateControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },




        });
          
          //adding data points to map from google fusion table
          createFusionTableLayer();
      
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
          
          
          
          //Google Directions API
          directionsService = new google.maps.DirectionsService();
          directionsDisplay = new google.maps.DirectionsRenderer();
          
          //associate directions renderer with map
          directionsDisplay.setMap(map);
          var directionsPanel = document.getElementById('googleDirectionsBox');
          directionsDisplay.setPanel(directionsPanel);
         
        delayedCall();
      
      }
    




























