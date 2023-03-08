import * as React from 'react';
import Map, {Marker} from 'react-map-gl';
import Image from 'next/image';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = () => {
  return (
    <Map
      initialViewState={{
        latitude: 35.6812,
        longitude: 139.7671,
        zoom: 14
      }}
      style={{height: "91vh", width: "100%"}}
      mapStyle="mapbox://styles/avicity7/clewhy0yo000901rzkk9xx3bt"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      attributionControl={false}
      maxZoom={15}
      >

      <Marker latitude={35.6812} longitude={139.7671} anchor="bottom" >
        <Image src="/img/Marker.png" alt="Marker" height="35" width="35"/>
      </Marker>
    </Map>
  );
}

export default MapView