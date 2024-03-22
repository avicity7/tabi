import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Stack, Spinner, Text, Show } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'phosphor-react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getCookie, setCookie } from 'cookies-next'
import Head from 'next/head'

import Navbar from '../components/navbar'
import getUsername from '../utils/getUsername'
import DestinationCard from '../components/destinationCard'
import MapPopup from '../components/mapPopup'

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
  const [username, setUsername] = useState(props.username !== undefined ? props.username : '')
  const userId = props.userId
  const [viewState, setViewState] = useState({
    latitude: 35.6812,
    longitude: 139.7671,
    zoom: 14
  })
  const supabaseClient = useSupabaseClient()

  const [serverDestinationData, setServerDestinationData] = useState([])
  const [serverJourneyName, setServerJourneyName] = useState('')

  const [currentDay, setCurrentDay] = useState(0)

  const [refresh, setRefresh] = useState(false)
  const [searchInputData, setSearchInputData] = useState({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined, notes: undefined, budget: undefined })

  const resetMapPopup = () => {
    setSearchInputData({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined, notes: undefined, budget: undefined })
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

  const SmallMapView = useMemo(() => dynamic(
    async () => await import('../components/smallMapView'),
    {
      loading: () =>
            <div className="flex justify-center items-center w-[100vw] h-[50vh] bg-white">
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
      const user = await supabaseClient.auth.getUser()

      let fetchedUsername = null
      if (user.data.user !== null) {
        fetchedUsername = await getUsername(user.data.user.id)
      }

      const { data } = await supabase
        .from('journeys')
        .select()
        .eq('id', router.query.journeyId)
        .single()

      if (fetchedUsername !== username) {
        setUsername(fetchedUsername)
      }
      if (getCookie('username') === undefined) {
        setCookie('username', fetchedUsername)
      }
      setServerJourneyName(data.journey_name)
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
        <Head>
          <title>{serverJourneyName} | tabi</title>
        </Head>

        <Navbar activePage={'journeyedit'} username={username}/>
        <Show above='lg'>
          <div className="grid grid-cols-4 font-DMSans">
              <div className="col-span-2 ml-4 mt-4 scrollbar mr-0">
                  <div className="flex flex-row items-center">
                      <button className="my-5" onClick={() => { router.back() }}>
                          <ArrowLeft color="black" size="18" className = "mx-auto" strokeWidth="10"/>
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
                                    <DestinationCard destination={destination} index={index} onClick={null}/>
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
                  <MapPopup userId={userId} router={router} searchInputData={searchInputData} resetMapPopup={resetMapPopup} userDestinationData={null} setUserDestinationData={null} updateDestinations={updateDestinations} refresh={refresh} setRefresh={setRefresh} currentDay={currentDay}/>
              </div>
          </div>
        </Show>

        <Show below='lg'>
          <div className="ml-4 my-3 flex flex-row items-center font-DMSans">
              <button onClick={() => { router.back() }}>
                  <ArrowLeft color="black" size="18" strokeWidth="5"/>
              </button>

              <Text className="font-bold text-lg ml-3.5">Destinations</Text>
          </div>

          {/* Map Destination Popup */}
          <div className="sticky bg-white font-DMSans">
              <SmallMapView viewState={viewState} setViewState={setViewState} userDestinationData={serverDestinationData} currentDay={currentDay} setSearchInputData={setSearchInputData} resetMapPopup={resetMapPopup} searchInputData={searchInputData} />
              <MapPopup userId={userId} router={router} searchInputData={searchInputData} resetMapPopup={resetMapPopup} userDestinationData={null} setUserDestinationData={null} updateDestinations={updateDestinations} refresh={refresh} setRefresh={setRefresh} currentDay={currentDay}/>
          </div>

          <div className="max-h-80 overflow-scroll font-DMSans">
              <div className="ml-4 mt-4">
                  {/* Day buttons */}
                  <div className="grid grid-cols-10 gap-0">
                      <Stack className='col-span-2 place-items-center'>
                          <ul>
                              {serverDestinationData.map((_, index) => (
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
                                    <DestinationCard destination={destination} index={index} onClick={null}/>
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
            </div>
        </Show>
      </>
    )
  }
}

export default JourneyDetails
