import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Input, Stack, Spinner, Text, Textarea, Card, CardBody } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'phosphor-react'
import { createClient } from '@supabase/supabase-js'

import Navbar from '../components/navbar'
import getUsername from '../utils/getUsername'
import SearchInput from '../components/searchInput'
import getPlaceIDDetails from '../utils/getPlaceIDDetails'

const JourneyEdit = (props) => {
  const router = useRouter()
  const username = props.username
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

  const [currentDay, setCurrentDay] = useState(0)

  const [refresh, setRefresh] = useState(false)
  const [editingJourneyName, setEditingJourneyName] = useState(false)
  const [editingJourneyBody, setEditingJourneyBody] = useState(false)

  const [searchInputData, setSearchInputData] = useState({ name: null, editorial_summary: { overview: null } })

  const MapView = useMemo(() => dynamic(
    async () => await import('../components/mapView'),
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
        .from('privateJourneys')
        .select()
        .eq('id', router.query.privateJourneyID)

      setServerDestinationData(data[0].destinations.days)
      setServerJourneyName(data[0].journey_name)
      setServerJourneyBody(data[0].journey_body)

      const getDetails = async () => {
        const tempCompleteArray = []
        for (let i = 0; i < data[0].destinations.days.length; i++) {
          const tempDayArray = []
          for (let x = 0; x < data[0].destinations.days[i]?.destinations.length; x++) {
            const placeData = await getPlaceIDDetails(data[0].destinations.days[i]?.destinations[i])
            tempDayArray.push(placeData)
          }
          tempCompleteArray.push({ day: i + 1, destinations: tempDayArray })
        }
        setUserDestinationData(tempCompleteArray)
        if (tempCompleteArray.length !== 0) {
          setViewState({
            latitude: tempCompleteArray[0].destinations[0].geometry.location.lat,
            longitude: tempCompleteArray[0].destinations[0].geometry.location.lng,
            zoom: 14
          })
        }
      }

      if (userDestinationData.length === 0) {
        getDetails()
        setUserJourneyName(data[0].journey_name)
        setUserJourneyBody(data[0].journey_body)
      }
    }

    if (serverDestinationData.length === 0) {
      fetchData()
      console.log('refreshing')
    }
  }, [router.query.privateJourneyID, router.isReady, userDestinationData.length, refresh, serverDestinationData.length, currentDay, userDestinationData])

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
                      <button className="my-5" onClick={() => { router.push('/') }}>
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
                            <button onClick={() => { setEditingJourneyName(!editingJourneyName) }}>
                              <Text className="font-medium text-sm text-tabiBlue">Save</Text>
                            </button>
                          }
                      </div>
                  }

                  <Text className="font-regular text-md px-8 mb-2">Journey Description</Text>
                  { !editingJourneyBody &&
                      <div className="px-8 pb-5">
                          <Text className="font-medium text-sm display-linebreak truncate">{userJourneyBody}</Text>
                          <button onClick={() => { setEditingJourneyBody(!editingJourneyBody) }}>
                            <Text className="font-light text-sm text-tabiBlue">Edit</Text>
                          </button>
                      </div>
                  }
                  { editingJourneyBody &&
                      <div className="px-8 pb-8">
                          <Textarea focusBorderColor='#268DC7' value={userJourneyBody} onChange={(e) => { setUserJourneyBody(e.target.value) }}/>
                          { userJourneyBody === serverJourneyBody &&
                            <button onClick={() => { setEditingJourneyBody(!editingJourneyBody) }}>
                              <Text className="font-light text-sm text-tabiBlue">Exit</Text>
                            </button>
                          }
                          { userJourneyBody !== serverJourneyBody &&
                            <button onClick={() => { setEditingJourneyBody(!editingJourneyBody) }}>
                              <Text className="font-medium text-sm text-tabiBlue">Save</Text>
                            </button>
                          }
                      </div>
                  }
                  <div className="ml-4 mb-4 mt-6">
                      <Text className="font-bold text-lg ml-3.5">Destinations</Text>
                  </div>

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
                                                    setCurrentDay(index)
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

                      <Stack className='col-span-8 flex justify-center px-5'>
                          <ul>
                          {userDestinationData[currentDay].destinations.map((destination, index) => (
                              <li key={destination}>
                                  <button onClick={() => {
                                    setViewState({
                                      latitude: destination.geometry.location.lat,
                                      longitude: destination.geometry.location.lng,
                                      zoom: 14
                                    })
                                  }}>
                                      <Card>
                                          <CardBody>
                                              <div className="flex flex-row items-center">

                                                  <Text className="text-tabiBlue text-md text-center font-bold mr-5">{parseInt(index) + 1}</Text>

                                                  <Stack>
                                                      <Text className="text-md font-medium text-left">{destination.name}</Text>
                                                      {destination.editorial_summary !== undefined &&
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

                          {userDestinationData[currentDay].destinations.length === 0 &&
                              <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4">No Destinations in this Day.</Text>
                          }

                          <div className="mt-8 min-w-[70%]">
                              <SearchInput viewState={viewState} setViewState={setViewState} setSearchInputData={setSearchInputData}/>
                          </div>
                      </Stack>
                  </div>
              </div>

              <div className="fixed top-13 right-0 bg-white col-span-2 max-w-[50vw] overflow-hidden">
                  <MapView viewState={viewState} setViewState={setViewState} userDestinationData={userDestinationData}/>
                  { Object.keys(searchInputData).length !== 2 &&
                      <Stack className="absolute inset-x-10 bottom-5 right-10 rounded-md bg-white shadow-md">
                        { searchInputData.editorial_summary === undefined &&
                            <Text className="py-5 px-5 font-medium text-left">{searchInputData.name}</Text>
                        }
                        { searchInputData.editorial_summary !== undefined &&
                          <>
                            <Text className="pt-5 px-5 font-medium text-left">{searchInputData.name}</Text>
                            <Text className="text-sm font-regular text-left px-5 pb-5">{searchInputData.editorial_summary.overview}</Text>
                          </>
                        }
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
  const journeyid = ctx.query?.privateJourneyID

  if (journeyid == null) {
    return {
      notFound: true
    }
  }

  const { data: { session } } = await supabase.auth.getSession()

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

export default JourneyEdit
