import * as React from 'react'
import Map, { Marker } from 'react-map-gl'
import Image from 'next/image'
import { useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import { Text } from '@chakra-ui/react'

const MapView = ({ viewState, setViewState, userDestinationData }) => {
  const [refresh, setRefresh] = useState(false)
  return (
    <>
    <button onClick={() => { setRefresh(!refresh) }}>
      <Text>Press me</Text>
    </button>
    <Map
      {...viewState}
      onMove={(e) => { setViewState(e.viewState) }}
      style={{ height: '91vh', width: '100%' }}
      mapStyle="mapbox://styles/avicity7/clewhy0yo000901rzkk9xx3bt"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      attributionControl={false}
      maxZoom={15}
      >
        {userDestinationData.map((day) => {
          return (
            day.destinations.map((destination) => {
              return (
                <Marker
                  key={destination.place_id}
                  latitude={34.7024854}
                  longitude={135.4959506}
                >
                <Image
                  src="/img/Marker.png"
                  alt="Marker"
                  height="35"
                  width="35"
                />
                </Marker>
              )
            })
          )
        })}
    </Map>
    </>
  )
}

export default MapView
