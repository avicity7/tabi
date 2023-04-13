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
        <div className="grid grid-cols-10 gap-0 px-5 lg:px-0">
            <Stack className='col-span-2 place-items-start lg:place-items-end'>
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
            <Stack className='col-span-8 flex items-end lg:items-center mx-0 lg:mx-5'>
                <ul>
                    {journeyDays[currentDay].destinations.map((destination, index) => (
                        <li key={destination.place_id}>
                            <button onClick={() => {
                            }}>
                            <DestinationCard destination={destination} index={index} />
                            </button>
                        </li>
                    ))}
                </ul>

                {journeyDays[currentDay].destinations.length === 0 &&
                    <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4 py-8">No Destinations in this Day.</Text>
                }

            </Stack>

        </div>

        <div className="grid grid-cols-10 gap-0 px-5 lg:px-0">
          <div className="col-span-10 lg:col-span-8 flex justify-center pt-5">
              <button
              onClick={ () => {
                router.push({
                  pathname: '/journeyDetails',
                  query: { journeyId }
                })
              }}
              >
                  <Text className="font-medium text-tabiBlue hover:text-tabiBlueDark text-sm ">Open Interactive Map</Text>
              </button>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <Skeleton height="200" />
    )
  }
}

export default MapPreview
