import { useState } from 'react'
import { Skeleton, Text, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import 'mapbox-gl/dist/mapbox-gl.css'

import DestinationCard from './destinationCard'

const MapPreview = ({ journeyDays, journeyId }) => {
  if (journeyDays.length !== 0) {
    const [currentDay, setCurrentDay] = useState(0)
    const router = useRouter()
    return (
      <>
        {/* Day buttons */}
        <div className="flex ml-5">
            <Stack className="mr-8">
                <ul>
                    {journeyDays.map((day, index) => (
                        <li key={index}>
                            <div className="grid place-items-center font-DMSans">
                                {/* Set day button to Blue, no hover effect */}
                                { index === currentDay &&
                                    <button className='text-[#268DC7] transition-none'>
                                        <p className="font-medium text-lg py-2">
                                            Day {parseInt(index) + 1}
                                        </p>
                                    </button>
                                }

                                {/* NOT the current day to display, hover effect added */}
                                { index !== currentDay &&
                                    <button
                                        className='text-[#CBCBCB] hover:text-tabiBlueDark transition-none'
                                        onClick={() => {
                                          setCurrentDay(index)
                                        }}
                                    >
                                        <p className="font-medium text-lg py-2">
                                            Day {parseInt(index) + 1}
                                        </p>
                                    </button>
                                }
                            </div>
                        </li>
                    ))}
                </ul>

            </Stack>

            {/* Destination Cards */}
            <Stack>
                <ul>
                    {journeyDays[currentDay].destinations.map((destination, index) => (
                        <li key={destination.place_id}>
                            <button
                              onClick={ () => {
                                router.push({
                                  pathname: '/journeyDetails',
                                  query: { journeyId }
                                })
                              }}
                            >
                            <DestinationCard destination={destination} index={index} onClick={null}/>
                            </button>
                        </li>
                    ))}
                </ul>

                {journeyDays[currentDay].destinations.length === 0 &&
                    <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4 py-8">No Destinations in this Day.</Text>
                }
            </Stack>
        </div>

        {/* <div className="mt-10 bg-red-400">
        </div> */}
      </>
    )
  } else {
    return (
      <Skeleton height="200" />
    )
  }
}

export default MapPreview
