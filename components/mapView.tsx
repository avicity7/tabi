import * as React from 'react'
import Map, { Marker } from 'react-map-gl'
import Image from 'next/image'
import { Text } from '@chakra-ui/react'

import 'mapbox-gl/dist/mapbox-gl.css'

const MapView = ({ viewState, setViewState, userDestinationData }) => {
  return (
    <Map
      {...viewState}
      onMove={(e) => { setViewState(e.viewState) }}
      style={{ height: '92vh', width: '50vw' }}
      mapStyle="mapbox://styles/avicity7/clewhy0yo000901rzkk9xx3bt"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      attributionControl={false}
      maxZoom={16}
      >
        {userDestinationData.map((day) => {
          return (
            day.destinations.map((destination, index) => {
              return (
                <Marker
                  key={destination.place_id}
                  latitude={34.7024854}
                  longitude={135.4959506}
                >
                <div className="static">
                  <Image
                    src="/img/Marker.png"
                    alt="Marker"
                    height="40"
                    width="40"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-DMSans pb-2">
                    <Text className="text-black font-bold">{parseInt(index) + 1}</Text>
                  </div>
                </div>
                </Marker>
              )
            })
          )
        })}
    </Map>
  )
}

export default MapView
