import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Stack, Spinner, Text, Card, CardBody, Image } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'phosphor-react'
import { createClient } from '@supabase/supabase-js'
import { Icon } from '@iconify-icon/react'

import Navbar from '../components/navbar'
import getUsername from '../utils/getUsername'

const updateDestinations = async (userDestinations, journeyId, userId) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')

  const { error } = await supabase
    .from('journeys')
    .update({ destinations: userDestinations })
    .match({ id: journeyId, user_id: userId })

  if (error) {
    console.log(error)
  }
}

const JourneyDetails = (props) => {
  const router = useRouter()
  const username = props.username
  const userId = props.userId
  const [viewState, setViewState] = useState({
    latitude: 35.6812,
    longitude: 139.7671,
    zoom: 14
  })

  const [serverDestinationData, setServerDestinationData] = useState([])

  const [currentDay, setCurrentDay] = useState(0)

  const [refresh, setRefresh] = useState(false)
  const [searchInputData, setSearchInputData] = useState({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined })

  const resetMapPopup = () => {
    setSearchInputData({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined })
  }

  const LargeMapView = useMemo(() => dynamic(
    async () => await import('../components/largeMapView'),
    {
      loading: () =>
            <div className="flex justify-center items-center w-[50vw] h-[91.2vh] bg-white">
                <Stack>
                    <div className="flex justify-center">
                        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                    </div>
                    <p className="font-DMSans font-medium">Loading the map...</p>
                </Stack>
            </div>,
      ssr: false
    }
  ), [])

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')
    const fetchData = async () => {
      if (!router.isReady) return

      const { data } = await supabase
        .from('journeys')
        .select()
        .eq('id', router.query.journeyId)
        .single()

      setServerDestinationData(data.destinations)

      if (serverDestinationData.length === 0) {
        setServerDestinationData(data.destinations)
        if (data.destinations[0].destinations.length !== 0) {
          setViewState({
            latitude: data.destinations[0].destinations[0].geometry.location.lat,
            longitude: data.destinations[0].destinations[0].geometry.location.lng,
            zoom: 14
          })
        }
      }
    }

    if (serverDestinationData.length === 0) {
      fetchData()
    }
  }, [router.query.privateJourneyID, router.isReady, refresh, currentDay])

  if (serverDestinationData.length === 0) { // Return loading Spinner
    return (
      <>
          <Navbar activePage={'index'} username={username}/>

          <div className="flex justify-center items-center h-[91.2vh]">
              <Stack>
                  <div className="flex justify-center">
                      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                  </div>
                  <p className="font-DMSans font-medium">Loading your Journey...</p>
              </Stack>
          </div>
      </>
    )
  } else {
    return (
      <>
          <Navbar activePage={'journeyedit'} username={username}/>

          <div className="grid grid-cols-4 font-DMSans">
              <div className="col-span-2 ml-4 mt-4 scrollbar mr-0">
                  <div className="flex flex-row items-center">
                      <button className="my-5" onClick={() => { router.push('/') }}>
                          <ArrowLeft color="black" size="18" className = "mx-auto" strokeWidth="5"/>
                      </button>

                      <Text className="font-bold text-lg ml-3.5">Destinations</Text>
                  </div>

                  {/* Day buttons */}
                  <div className="grid grid-cols-10 gap-0">
                      <Stack className='col-span-2 place-items-center'>
                          <ul>
                              {serverDestinationData.map((day, index) => (
                                  <li key={index}>
                                      <div className="grid place-items-center font-DMSans">
                                          {/* Set day button to Blue, no hover effect */}
                                          { index === currentDay &&
                                              <button className='text-[#268DC7] transition-none'>
                                                  <p className="font-medium text-lg py-2">
                                                      Day {index + 1}
                                                  </p>
                                              </button>
                                          }

                                          {/* NOT the current day to display, hover effect added */}
                                          { index !== currentDay &&
                                              <button
                                                  className='text-[#CBCBCB] hover:text-tabiBlueDark transition-none'
                                                  onClick={() => {
                                                    try {
                                                      setViewState({
                                                        latitude: serverDestinationData[index].destinations[0].geometry.location.lat,
                                                        longitude: serverDestinationData[index].destinations[0].geometry.location.lng,
                                                        zoom: 10
                                                      })
                                                    } catch {
                                                      setViewState({
                                                        latitude: viewState.latitude,
                                                        longitude: viewState.longitude,
                                                        zoom: 10
                                                      })
                                                    }
                                                    setCurrentDay(index)
                                                    resetMapPopup()
                                                  }}
                                              >
                                                  <p className="font-medium text-lg py-2">
                                                      Day {index + 1}
                                                  </p>
                                              </button>
                                          }
                                      </div>
                                  </li>
                              ))}
                          </ul>

                      </Stack>

                      {/* Destination Cards */}
                      <Stack className='col-span-8 flex justify-center items-center mx-5'>
                          <ul>
                          {serverDestinationData[currentDay].destinations.map((destination, index) => (
                              <li key={destination.place_id}>
                                  <button onClick={() => {
                                    setViewState({
                                      latitude: destination.geometry.location.lat,
                                      longitude: destination.geometry.location.lng,
                                      zoom: 14
                                    })
                                    setSearchInputData(destination)
                                  }}>
                                      <Card className="my-2" minW="lg" maxW="lg">
                                          <CardBody>
                                              <div className="flex flex-row items-center px-1">
                                                  <Text className="text-tabiBlue text-md text-center font-bold mr-5">{parseInt(index) + 1}</Text>

                                                  <Stack>
                                                      <div className="flex items-center">
                                                        <Text className="text-md font-medium text-left mr-2">{destination.name}</Text>
                                                        <Image src={destination.icon} alt="icon" boxSize='12px'></Image>
                                                      </div>
                                                      { destination.editorial_summary !== undefined &&
                                                        <Text className="text-sm font-regular text-left">{destination.editorial_summary.overview}</Text>
                                                      }
                                                  </Stack>
                                              </div>
                                          </CardBody>
                                      </Card>
                                  </button>
                              </li>
                          ))}
                          </ul>

                          {serverDestinationData[currentDay].destinations.length === 0 &&
                              <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4 py-8">No Destinations in this Day.</Text>
                          }

                      </Stack>
                  </div>
              </div>

              {/* Map Destination Popup */}
              <div className="fixed top-13 right-0 bg-white col-span-2 max-w-[50vw] overflow-hidden">
                  <LargeMapView viewState={viewState} setViewState={setViewState} userDestinationData={serverDestinationData} currentDay={currentDay} setSearchInputData={setSearchInputData} resetMapPopup={resetMapPopup} searchInputData={searchInputData} />
                  { Object.keys(searchInputData).length !== 4 &&
                      <Stack className="absolute inset-x-10 bottom-5 right-10 rounded-md bg-white shadow-md py-5 px-5 shadow-xl">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Text className="font-medium text-left mr-2">{searchInputData.name}</Text>
                            { searchInputData.icon !== undefined &&
                              <Image src={searchInputData.icon} alt="icon" boxSize='12px'></Image>
                            }
                          </div>
                          <button onClick={resetMapPopup}>
                            <Icon icon="ic:round-close"/>
                          </button>
                        </div>
                        { searchInputData.editorial_summary !== undefined &&
                          <Text className="text-sm font-regular text-left">{searchInputData.editorial_summary.overview}</Text>
                        }
                        <div className="flex flex-row items-center min-w-full pt-2">
                          { searchInputData.website !== undefined &&
                            <a href={searchInputData.website} rel="noopener noreferrer" target="_blank">
                              <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark">
                                <Icon icon="material-symbols:web-asset" />
                                <Text className="ml-1 text-sm font-medium text-left">Website</Text>
                              </div>
                            </a>
                          }
                          <div className="flex grow justify-end">
                            { serverDestinationData[currentDay].destinations.includes(searchInputData) === false &&
                            <button onClick={() => {
                              const temp = serverDestinationData
                              temp[currentDay].destinations.push(searchInputData)
                              setServerDestinationData(temp)
                              updateDestinations(temp, router.query.journeyId, userId)
                              setRefresh(!refresh)
                            }}>
                              <Text className="text-sm text-white font-regular text-left bg-tabiBlue hover:bg-tabiBlueDark px-4 py-1 rounded-full">Add Destination</Text>
                            </button>
                            }
                          </div>
                        </div>
                      </Stack>
                  }
              </div>
          </div>
      </>
    )
  }
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  let fetchedUsername = ''
  const journeyid = ctx.query?.journeyId

  const { data: { session } } = await supabase.auth.getSession()

  if (journeyid == null) {
    return {
      notFound: true
    }
  }

  const fetchUsername = async () => {
    try {
      fetchedUsername = await getUsername(session.user.id)
      return fetchedUsername
    } catch {
      return fetchedUsername
    }
  }

  const username = await fetchUsername()

  return {
    props: {
      username
    }
  }
}

export default JourneyDetails
