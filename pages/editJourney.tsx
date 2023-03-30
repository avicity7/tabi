import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Input, Stack, Spinner, Text, Textarea, Card, CardBody, Image, Radio, RadioGroup } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft } from 'phosphor-react'
import { createClient } from '@supabase/supabase-js'
import { Icon } from '@iconify-icon/react'

import Navbar from '../components/navbar'
import getUsername from '../utils/getUsername'
import SearchInput from '../components/searchInput'

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
  const [notes, setNotes] = useState('')

  const [currentDay, setCurrentDay] = useState(0)

  const [refresh, setRefresh] = useState(false)
  const [editingJourneyName, setEditingJourneyName] = useState(false)
  const [editingJourneyBody, setEditingJourneyBody] = useState(false)
  const [addingNotes, setAddingNotes] = useState(false)

  const [searchInputData, setSearchInputData] = useState({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined, notes: undefined })

  const resetMapPopup = () => {
    setSearchInputData({ name: undefined, editorial_summary: { overview: undefined }, website: undefined, icon: undefined, notes: undefined })
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
                                                      { destination.notes !== undefined &&
                                                        <Stack>
                                                          <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Notes</Text>
                                                          <Text className="text-sm font-regular text-left">{destination.notes}</Text>
                                                        </Stack>
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
                  { Object.keys(searchInputData).length !== 5 &&
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
                        { searchInputData.notes !== undefined && !addingNotes &&
                          <Stack className="pb-2">
                            <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Notes</Text>
                            <Text className="text-sm font-regular text-left">{searchInputData.notes}</Text>
                          </Stack>
                        }
                        {addingNotes &&
                          <Stack>
                              <button className="flex flex-row items-center" onClick={ () => {
                                setAddingNotes(false)
                              }}>
                                <Icon icon="ic:round-close" className='text-[#CBCBCB] hover:text-gray-400'/>
                              </button>
                              <Textarea value={notes} placeholder="Enter notes" className="text-sm" onChange={ (e) => { setNotes(e.target.value) }}/>
                              <button className='flex justify-start w-fit' onClick={ () => {
                                setAddingNotes(false)
                                const index = userDestinationData[currentDay].destinations.indexOf(searchInputData)
                                if (notes !== '') {
                                  userDestinationData[currentDay].destinations[index].notes = notes
                                } else {
                                  userDestinationData[currentDay].destinations[index].notes = undefined
                                }
                                updateDestinations(userDestinationData, router.query.journeyId, userId)
                                setRefresh(!refresh)
                              }}>
                                <Text className="text-sm text-tabiBlue hover:text-tabiBlueDark">Save</Text>
                              </button>
                          </Stack>
                        }
                        <div className="flex flex-row items-center min-w-full pt-2">
                          <button onClick={ () => { setNotes(searchInputData.notes); setAddingNotes(true) }}>
                              {searchInputData.notes === undefined &&
                                 <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-4">
                                  <Icon icon="mi:add" />
                                  <Text className="ml-1 text-sm font-medium text-left">Add Notes</Text>
                                </div>
                              }
                              {searchInputData.notes !== undefined &&
                                <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-4">
                                  <Icon icon="iconoir:edit-pencil" />
                                  <Text className="ml-1 text-sm font-medium text-left">Edit Notes</Text>
                                </div>
                              }
                          </button>
                          { searchInputData.website !== undefined &&
                            <a href={searchInputData.website} rel="noopener noreferrer" target="_blank">
                              <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark">
                                <Icon icon="material-symbols:web-asset" />
                                <Text className="ml-1 text-sm font-medium text-left">Website</Text>
                              </div>
                            </a>
                          }
                          <div className="flex grow justify-end">
                            { userDestinationData[currentDay].destinations.includes(searchInputData) === false &&
                            <button onClick={() => {
                              const temp = userDestinationData
                              temp[currentDay].destinations.push(searchInputData)
                              setUserDestinationData(temp)
                              updateDestinations(temp, router.query.journeyId, userId)
                              setRefresh(!refresh)
                            }}>
                              <Text className="text-sm text-white font-regular text-left bg-tabiBlue hover:bg-tabiBlueDark px-4 py-1 rounded-full">Add Destination</Text>
                            </button>
                            }

                            { userDestinationData[currentDay].destinations.includes(searchInputData) === true &&
                            <button onClick={() => {
                              userDestinationData[currentDay].destinations.splice(userDestinationData[currentDay].destinations.indexOf(searchInputData), 1)
                              updateDestinations(userDestinationData, router.query.journeyId, userId)
                              setRefresh(!refresh)
                            }}>
                              <Text className="text-sm text-white font-regular text-left bg-red-600 hover:bg-red-700 px-4 py-1 rounded-full">Remove Destination</Text>
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
