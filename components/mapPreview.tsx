import * as React from 'react'
import Map, { Marker } from 'react-map-gl'
import Image from 'next/image'
import { Skeleton, Text } from '@chakra-ui/react'
import 'mapbox-gl/dist/mapbox-gl.css'

const MapPreview = ({ journeyDays }) => {
  if (journeyDays.length !== 0) {
    return (
      <Map
        latitude={journeyDays[0].destinations[0].geometry.location.lat}
        longitude={journeyDays[0].destinations[0].geometry.location.lng}
        zoom = {12}
        style={{ height: '300px', width: '100%' }}
        mapStyle="mapbox://styles/avicity7/clewhy0yo000901rzkk9xx3bt?optimize=true"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        attributionControl={false}
        cursor={'default'}
        scrollZoom={false}
        >
          {journeyDays.map((day) => {
            return (
              day.destinations.map((destination, index) => {
                return (
                  <Marker
                    key={destination.place_id}
                    latitude={destination.geometry.location.lat}
                    longitude={destination.geometry.location.lng}
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
              }))
          })}
      </Map>
    )
  } else {
    return (
      <Skeleton height="200" />
    )
  }
}

export default MapPreview
