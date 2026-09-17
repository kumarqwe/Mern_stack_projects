  let mapToken = maptoken;
      const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: [83.896782, 18.296974] // center the map on this longitude and latitude
    });
