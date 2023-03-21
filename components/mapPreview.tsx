import * as React from 'react'
import Map, { Marker } from 'react-map-gl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Skeleton, Text } from '@chakra-ui/react'
import 'mapbox-gl/dist/mapbox-gl.css'

import getPlaceIDDetails from '../utils/getPlaceIDDetails'

const MapPreview = ({ journeyDays }) => {
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    const getDestinations = async () => {
      const temp = []
      for (let day = 0; day < journeyDays.length; day++) {
        for (let destination = 0; destination < journeyDays[day].destinations.length; destination++) {
          temp.push(await getPlaceIDDetails(journeyDays[day].destinations[destination]))
        }
      }
      setDestinations(temp)
    }
    getDestinations()
  }, [])

  if (destinations.length !== 0) {
    return (
      <Map
        latitude={destinations[0].geometry.location.lat}
        longitude={destinations[0].geometry.location.lng}
        zoom = {12}
        style={{ height: '30vh', width: '100' }}
        mapStyle="mapbox://styles/avicity7/clewhy0yo000901rzkk9xx3bt"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        attributionControl={false}
        maxZoom={16}
        >
          {destinations.map((destination, index) => {
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
                  <Text className="text-black font-bold">{index + 1}</Text>
                </div>
              </div>
              </Marker>
            )
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
