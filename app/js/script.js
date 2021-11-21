console.log("Load script.js");

// Instantiating the global app object
let app = {};

let map;

function initMap() {
  const myLatLng = { lat: 1.286920, lng: 103.854570 };
  const map = new google.maps.Map(document.getElementById("map"), {
    mapId: "a02862ca273b2728",
    center: myLatLng,
    zoom: 15,
  });

  // Custom SVG Marker
  const svgMarker = {
    url: 'dist/img/marker.svg',
    scaledSize: new google.maps.Size(75, 75), 
    origin: new google.maps.Point(0, 0), 
    anchor: new google.maps.Point(30, 30) 
  };

  let marker, i;
  let markers = new Array();

  // Extract JSON into data. Inspired by (https://www.svennerberg.com/2012/03/adding-multiple-markers-to-google-maps-from-json/)
  $.getJSON("app/js/data.json", function (json) {
    for (i = 0; i < json.length; i++) {
      const data = json[i]
      const title = data.title;
      const subtitle = data.subtitle;
      const description = data.description;
      const image = data.image;
      const address = data.address;
      const site = data.site;
      const location = new google.maps.LatLng(data.lat, data.lng);

      const contentString =
        '<div class="map-info">' +
        '<h6 class="title">' +
        title +
        '</h6>' +
        '<p class="subtitle">' +
        address +
        '</p>' +
        "</div>";
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        pixelOffset: new google.maps.Size(30,50)
      });

      const marker = new google.maps.Marker({
        position: location,
        map,
        icon: svgMarker,
      })

      // Marker click event
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          map.setZoom(17);
          map.setCenter(marker.getPosition());
          $(".map-info").not(":eq(" + i + ")").removeClass("active");
          $(".map-info").eq(i).addClass("active");
          $(".overlay").addClass("active");
          $(".overlay__image").attr("src", image);
          $(".overlay__title").html(title);
          $(".text--subtitle").html(subtitle);
          $(".text--description").html(description);
          $(".text--address").html(address);
          $(".text--site").html(site);
          
          // Adding class active to sidenav menu
          let nav = $('.link-menu[data-markerid = ' + i + ']')
          nav.addClass('active');
          nav.parent().siblings().find(".active").removeClass('active');
        }
      })(marker, i));
      markers.push(marker);

      google.maps.event.addListener(map, 'center_changed', (function (marker, i) {
        return function () {
          window.setTimeout(() => {
            map.panTo(marker.getPosition());
          }, 3000);
        }
      }));
      infowindow.open(map, marker);
      // Sidenav Menu click event
      $('.link-menu').on('click', function () {
        $(this).addClass('active');
        $(this).parent().siblings().find(".active").removeClass('active');
        $(this).parent().siblings().find(".show").removeClass('show');
        $(this).parent().siblings().find(".link-menu--collapse").addClass('collapsed');
        google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
      });
      // Close infowindow and remove active class click event
      $('.icon--close').on('click', function () {
        $('.link-menu').removeClass('active');
        $('.overlay').removeClass('active');
        $(".map-info").removeClass("active");
      });
    }
  });
}