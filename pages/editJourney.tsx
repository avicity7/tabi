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

  const [currentDay, setCurrentDay] = useState(1)

  const [refresh, setRefresh] = useState(false)
  const [editingJourneyName, setEditingJourneyName] = useState(false)
  const [editingJourneyBody, setEditingJourneyBody] = useState(false)

  const [searchInputData, setSearchInputData] = useState({ name: null })

  const MapView = useMemo(() => dynamic(
    async () => await import('../components/mapView'),
    {
      loading: () =>
            <div className="flex justify-center items-center h-[91.2vh]">
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
            <div className="isolate bg-white">
                <Navbar activePage={'index'} username={username}/>

                <div className="flex justify-center items-center h-[91.2vh]">
                    <Stack>
                        <div className="flex justify-center">
                            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                        </div>
                        <p className="font-DMSans font-medium">Loading your Journey...</p>
                    </Stack>
                </div>
            </div>
    )
  } else {
    return (
            <div className="isolate bg-white">
                <Navbar activePage={'journeyedit'} username={username}/>

                <div className="grid grid-cols-4 font-DMSans">
                    <div className="col-span-2 ml-4 mt-4">
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
                            </div>
                        }
                        { editingJourneyName &&
                            <div className="px-8 pb-5">
                                <Input focusBorderColor='#268DC7'/>
                            </div>
                        }

                        <Text className="font-regular text-md px-8 mb-2">Journey Description</Text>
                        { !editingJourneyBody &&
                            <div className="px-8 pb-5">
                                <Text className="font-medium text-sm display-linebreak truncate">{userJourneyBody}</Text>
                            </div>
                        }
                        { editingJourneyBody &&
                            <div className="px-8 pb-8">
                                <Textarea focusBorderColor='#268DC7' resize={'vertical'}/>
                            </div>
                        }
                        <div className="ml-4 mb-4 mt-6">
                            <Text className="font-bold text-lg ml-3.5">Destinations</Text>
                        </div>

                        <div className="grid grid-cols-9 gap-0">
                            <Stack className='col-span-2 place-items-center'>
                                <ul>
                                    {userDestinationData.map((day) => (
                                        <li key={day.day}>
                                            <div className="grid place-items-center font-DMSans">
                                                {/* Set day button to Blue, no hover effect */}
                                                { day.day === currentDay &&
                                                    <button className='text-[#268DC7] transition-none'>
                                                        <p className="font-medium text-lg py-2">
                                                            Day {day.day}
                                                        </p>
                                                    </button>
                                                }

                                                {/* NOT the current day to display, hover effect added */}
                                                { day.day !== currentDay &&
                                                    <button
                                                        className='text-[#CBCBCB] hover:text-tabiBlueDark transition-none'
                                                        onClick={() => {
                                                          setCurrentDay(day.day)
                                                        }}
                                                    >
                                                        <p className="font-medium text-lg py-2">
                                                            Day {day.day}
                                                        </p>
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <button className='text-[#CBCBCB] hover:text-tabiBlueDark transition-none' onClick={() => {
                                  const data = userDestinationData
                                  data.push({ day: parseInt(userDestinationData[userDestinationData.length - 1].day) + 1, destinations: [] })
                                  setUserDestinationData(data)
                                  setRefresh(!refresh)
                                }}>
                                    <p className="font-bold text-xl">+</p>
                                </button>
                            </Stack>

                            <div className='col-span-7 grid place-items-center'>
                                <ul>
                                {userDestinationData[currentDay - 1].destinations.map((destination) => (
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

                                                        <Text className="text-tabiBlue text-md text-center font-bold mr-5">{parseInt(userDestinationData[currentDay - 1].destinations.indexOf(destination)) + 1}</Text>

                                                        <Stack>
                                                            <Text className="text-md font-medium text-left">{destination.name}</Text>
                                                            <Text className="text-sm font-regular text-left">{destination.editorial_summary.overview}</Text>
                                                        </Stack>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </button>
                                    </li>
                                ))}
                                </ul>

                                {userDestinationData[currentDay - 1].destinations.length === 0 &&
                                    <Text className="flex text-sm text-gray-400 font-medium justify-center mr-4">No Destinations in this Day.</Text>
                                }

                                <div className="mt-8 min-w-[70%]">
                                    <SearchInput viewState={viewState} setViewState={setViewState} setSearchInputData={setSearchInputData}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky top-[10vh] min-h-[90vh] max-h-[90vh] col-span-2 rounded-xl overflow-hidden mr-2">
                        <MapView viewState={viewState} setViewState={setViewState} userDestinationData={userDestinationData}/>
                        { Object.keys(searchInputData).length !== 1 &&
                            <Text className="absolute inset-x-10 bottom-5 right-10 rounded-md bg-white shadow-md">{searchInputData.name}</Text>
                        }
                    </div>
                </div>

            </div>
    )
  }
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  let fetchedUsername = ''
  let user = ''
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

  try {
    user = session.user.id
  } catch {

  }

  return {
    props: {
      username,
      user
    }
  }
}

export default JourneyEdit
