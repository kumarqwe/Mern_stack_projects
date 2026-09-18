  let mapToken = maptoken;
      const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: listings.geometry.coordinates // center the map on this longitude and latitude
    });

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listings.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listings.location}'</h4><p>Exact location will be provided after the booking</p>`)
    .setMaxWidth("300px"))
    .addTo(map);