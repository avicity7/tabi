import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Input, Stack, Spinner, Text, Textarea, Radio, RadioGroup } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'phosphor-react'
import { createClient } from '@supabase/supabase-js'

import Navbar from '../components/navbar'
import getUsername from '../utils/getUsername'
import SearchInput from '../components/searchInput'
import DestinationCard from '../components/destinationCard'
import MapPopup from '../components/mapPopup'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')

const updateDestinations = async (userDestinations, journeyId, userId) => {
  const { error } = await supabase
    .from('journeys')
    .update({ destinations: userDestinations })
    .match({ id: journeyId, user_id: userId })

  if (error) {
    console.log(error)
  }
}

const updateVisibility = async (isPublic, journeyId, userId) => {
  const { error } = await supabase
    .from('journeys')
    .update({ public: isPublic === 'public' })
    .match({ id: journeyId, user_id: userId })

  if (error) {
    console.log(error)
  }
}

const updateJourneyName = async (journeyName, journeyId, userId) => {
  const { error } = await supabase
    .from('journeys')
    .update({ journey_name: journeyName })
    .match({ id: journeyId, user_id: userId })

  if (error) {
    console.log(error)
  }
}

const updateJourneyBody = async (journeyBody, journeyId, userId) => {
  const { error } = await supabase
    .from('journeys')
    .update({ journey_body: journeyBody })
    .match({ id: journeyId, user_id: userId })

  if (error) {
    console.log(error)
  }
}

const EditJourney = (props) => {
  const router = useRouter()
  const username = props.username
  const userId = props.userId
  const [viewState, setViewState] = useState({
    latitude: 35.6812,
    longitude: 139.7671,
    zoom: 14
  })

  const [serverDestinationData, setServerDestinationData] = useState([])
  const [userDestinationData, setUserDestinationData] = useState([])
  const [serverJourneyName, setServerJourneyName] = useState('')
  const [userJourneyName, setUserJourneyName] = useState('')
  const [serverJourneyBody, setServerJourneyBody] = useState('')
  const [userJourneyBody, setUserJourneyBody] = useState('')
  const [isPublic, setPublic] = useState('')
  const [journeyId, setJourneyId] = useState()

  const [currentDay, setCurrentDay] = useState(0)

  const [refresh, setRefresh] = useState(false)
  const [editingJourneyName, setEditingJourneyName] = useState(false)
  const [editingJourneyBody, setEditingJourneyBody] = useState(false)

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

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')
    const fetchData = async () => {
      if (!router.isReady) return

      const { data } = await supabase
        .from('journeys')
        .select()
        .eq('id', router.query.journeyId)
        .single()

      console.log(data.destinations)
      setServerDestinationData(data.destinations)
      setServerJourneyName(data.journey_name)
      setServerJourneyBody(data.journey_body)

      setPublic(data.public === true ? 'public' : 'private')

      if (userDestinationData.length === 0) {
        setUserDestinationData(data.destinations)
        setUserJourneyName(data.journey_name)
        setUserJourneyBody(data.journey_body)
        if (data.destinations[0].destinations.length !== 0) {
          setViewState({
            latitude: data.destinations[0].destinations[0].geometry.location.lat,
            longitude: data.destinations[0].destinations[0].geometry.location.lng,
            zoom: 14
          })
        }
        setJourneyId(data.id)
      }
    }

    if (serverDestinationData.length === 0) {
      fetchData()
    }
    updateVisibility(isPublic, journeyId, userId)
  }, [router.query.privateJourneyID, router.isReady, refresh, currentDay, isPublic])

  if (userDestinationData.length === 0) { // Return loading Spinner
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
                      <button className="my-5" onClick={() => { router.back() }}>
                          <ArrowLeft color="black" size="18" className = "mx-auto" strokeWidth="5"/>
                      </button>

                      <Text className="font-bold text-lg ml-3.5">Journey Details</Text>
                  </div>

                  <Text className="font-regular text-md px-8 mb-2">Journey Name</Text>
                  { !editingJourneyName &&
                      <div className="px-8 pb-5">
                        <Text className="font-medium text-lg">{userJourneyName}</Text>
                        <button onClick={() => { setEditingJourneyName(!editingJourneyName) }}>
                          <Text className="font-light text-sm text-tabiBlue">Edit</Text>
                        </button>
                      </div>
                  }
                  { editingJourneyName &&
                      <div className="px-8 pb-5">
                          <Input focusBorderColor='#268DC7' value={userJourneyName} onChange={(e) => { setUserJourneyName(e.target.value) }}/>
                          { userJourneyName === serverJourneyName &&
                            <button onClick={() => { setEditingJourneyName(!editingJourneyName) }}>
                              <Text className="font-light text-sm text-tabiBlue">Exit</Text>
                            </button>
                          }
                          { userJourneyName !== serverJourneyName &&
                            <button onClick={() => { updateJourneyName(userJourneyName, journeyId, userId); setEditingJourneyName(!editingJourneyName) }}>
                              <Text className="font-medium text-sm text-tabiBlue">Save</Text>
                            </button>
                          }
                      </div>
                  }

                  <Text className="font-regular text-md px-8 mb-2">Journey Description</Text>
                  { !editingJourneyBody &&
                      <div className="px-8 pb-5">
                          <Text className="font-medium text-sm display-linebreak" noOfLines={2}>{userJourneyBody}</Text>
                          <button onClick={() => { setEditingJourneyBody(!editingJourneyBody) }}>
                            <Text className="font-light text-sm text-tabiBlue">Edit</Text>
                          </button>
                      </div>
                  }
                  { editingJourneyBody &&
                      <div className="px-8 pb-8">
                          <Textarea className="scrollbar" focusBorderColor='#268DC7' value={userJourneyBody} onChange={(e) => { setUserJourneyBody(e.target.value) }}/>
                          { userJourneyBody === serverJourneyBody &&
                            <button onClick={() => { setEditingJourneyBody(!editingJourneyBody) }}>
                              <Text className="font-light text-sm text-tabiBlue">Exit</Text>
                            </button>
                          }
                          { userJourneyBody !== serverJourneyBody &&
                            <button onClick={() => { updateJourneyBody(userJourneyBody, journeyId, userId); setEditingJourneyBody(!editingJourneyBody) }}>
                              <Text className="font-medium text-sm text-tabiBlue">Save</Text>
                            </button>
                          }
                      </div>
                  }
                  <Text className="font-regular text-md px-8 mb-2">Visibility</Text>
                  <div className="px-8 pb-8">
                    <RadioGroup onChange={setPublic} value={isPublic}>
                      <Stack className="text-sm font-medium">
                        <Radio borderWidth="4px" _checked={{ bg: 'white', color: 'white', borderColor: '#268DC7' }} value={'public'}>Public</Radio>
                        <Radio borderWidth="4px" _checked={{ bg: 'white', color: 'white', borderColor: '#268DC7' }} value={'private'}>Private</Radio>
                      </Stack>
                    </RadioGroup>
                  </div>
                  <div className="ml-4 mb-4 mt-6">
                      <Text className="font-bold text-lg ml-3.5">Destinations</Text>
                  </div>

                  {/* Day buttons */}
                  <div className="grid grid-cols-10 gap-0">
                      <Stack className='col-span-2 place-items-center'>
                          <ul>
                              {userDestinationData.map((day, index) => (
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
                                                        latitude: userDestinationData[index].destinations[0].geometry.location.lat,
                                                        longitude: userDestinationData[index].destinations[0].geometry.location.lng,
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

                          <button className='text-[#CBCBCB] hover:text-tabiBlueDark transition-none' onClick={() => {
                            const data = userDestinationData
                            data.push({ destinations: [] })
                            setUserDestinationData(data)
                            setRefresh(!refresh)
                          }}>
                              <p className="font-bold text-xl">+</p>
                          </button>
                      </Stack>

                      {/* Destination Cards */}
                      <Stack className='col-span-8 flex justify-center items-center mx-5'>
                          <ul>
                          {userDestinationData[currentDay].destinations.map((destination, index) => (
                              <li key={destination.place_id}>
                                  <button onClick={() => {
                                    setViewState({
                                      latitude: destination.geometry.location.lat,
                                      longitude: destination.geometry.location.lng,
                                      zoom: 14
                                    })
                                    setSearchInputData(destination)
                                  }}>
                                      <DestinationCard destination={destination} index={index} />
                                  </button>
                              </li>
                          ))}
                          </ul>

                          {userDestinationData[currentDay].destinations.length === 0 &&
                              <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4 py-8">No Destinations in this Day.</Text>
                          }

                          <div className="mt-8 min-w-[70%] pb-16">
                              <SearchInput viewState={viewState} setViewState={setViewState} setSearchInputData={setSearchInputData}/>
                          </div>
                      </Stack>
                  </div>
              </div>

              {/* Map Destination Popup */}
              <div className="fixed top-13 right-0 bg-white col-span-2 max-w-[50vw] overflow-hidden">
                  <LargeMapView viewState={viewState} setViewState={setViewState} userDestinationData={userDestinationData} currentDay={currentDay} setSearchInputData={setSearchInputData} resetMapPopup={resetMapPopup} searchInputData={searchInputData} />
                  <MapPopup userId={userId} router={router} searchInputData={searchInputData} resetMapPopup={resetMapPopup} userDestinationData={userDestinationData} setUserDestinationData={setUserDestinationData} updateDestinations={updateDestinations} refresh={refresh} setRefresh={setRefresh} currentDay={currentDay}/>
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

  if (journeyid == null || session == null) {
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
  const userId = session.user.id

  return {
    props: {
      username,
      userId
    }
  }
}

export default EditJourney
