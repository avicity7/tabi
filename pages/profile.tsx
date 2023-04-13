import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {
  Text,
  Avatar,
  Stack,
  Spinner,
  Card,
  CardBody,
  Image
} from '@chakra-ui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getCookie, setCookie } from 'cookies-next'
import Head from 'next/head'
import Link from 'next/link'

import Navbar from '../components/navbar'
import JourneyCreateButton from '../components/journeyCreateButton'
import getUsername from '../utils/getUsername'
import Footer from '../components/footer'

const Profile = (props) => {
  const router = useRouter()
  const [username, setUsername] = useState(props.username !== undefined ? props.username : '')

  const [publicJourneys, setPublicJourneys] = useState([])
  const [privateJourneys, setPrivateJourneys] = useState([])
  const [loaded, setLoaded] = useState(false)
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const fetchData = async () => {
      const user = await supabaseClient.auth.getUser()

      let fetchedUsername = null
      if (user.data.user !== null) {
        fetchedUsername = await getUsername(user.data.user.id)
      }

      const { data: publicJourneys } = await supabase
        .from('journeys')
        .select()
        .match({ user_id: user.data.user.id, public: true })

      const { data: privateJourneys } = await supabase
        .from('journeys')
        .select()
        .match({ user_id: user.data.user.id, public: false })

      if (fetchedUsername !== username) {
        setUsername(fetchedUsername)
      }
      if (getCookie('username') === undefined) {
        setCookie('username', fetchedUsername)
      }
      setPublicJourneys(publicJourneys)
      setPrivateJourneys(privateJourneys)
      setLoaded(!loaded)
    }

    if (!loaded) {
      fetchData()
    }
  }, [username, loaded])

  if (!loaded) {
    return (
      <div className="isolate bg-white flex flex-col h-screen justify-between">
          <Head>
            <title>Profile | tabi</title>
          </Head>

          <Navbar activePage={'profile'} username={username}/>

          <div className="grid place-items-center">
              <Stack>
                  <div className="justify-center px-auto mx-auto mb-5">
                      <p className='font-DMSans font-bold text-sm mb-5' style = {{ color: '#268DC7' }}>Your Account</p>
                      <Avatar name = {username} size = "xl" />
                  </div>
                  <div className="flex justify-center">
                      <span className='font-DMSans text-2xl'>{username}</span>
                  </div>
              </Stack>
          </div>

          <JourneyCreateButton />

          <div className="flex justify-center items-center h-[91.2vh]">
              <Stack>
                  <div className="flex justify-center">
                      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                  </div>
                  <p className="font-DMSans font-medium">Loading...</p>
              </Stack>
          </div>

          <Footer />
      </div>
    )
  } else {
    return ( // Logged in user page
      <div className="isolate bg-white flex flex-col h-screen justify-between">
          <Head>
            <title>Profile | tabi</title>
          </Head>

          <Navbar activePage={'profile'} username={username}/>

          <div className="grid place-items-center mb-5">
              <Stack>
                  <div className="justify-center px-auto mx-auto mb-5">
                      <p className='font-DMSans font-bold text-sm mb-5' style = {{ color: '#268DC7' }}>Your Account</p>
                      <Avatar name = {username} size = "xl" />
                  </div>
                  <div className="flex justify-center">
                      <span className='font-DMSans text-2xl'>{username}</span>
                  </div>
              </Stack>
          </div>

          <JourneyCreateButton />

          { privateJourneys.length !== 0 &&
              <div className="font-DMSans px-10 my-3">
                  <Text className="font-medium text-lg">Your Private Journeys</Text>
                  <ul>
                    {privateJourneys.map((journey) => (
                      <li key={journey.id}>
                          <div className="grid place-items-start font-DMSans">
                            <Link href={`/journeys/${encodeURIComponent(journey.id)}`}>
                              <Card minW={'xs'} maxW={'xs'} className = "my-5 shadow-none" overflow="hidden" variant="unstyled">
                                {journey.destinations[0].destinations[1] === undefined &&
                                  <Image className="rounded-xl" minH="250" maxH="250" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                }
                                {journey.destinations[0].destinations[1] !== undefined &&
                                  <div className="grid grid-cols-5 max-h-full rounded-xl">
                                    <>
                                      <Image className="col-span-3 rounded-l-xl" minH="250" maxH="250" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                      <div className="col-span-2">
                                        {journey.destinations[0].destinations[2] !== undefined &&
                                          <>
                                            <Image className="rounded-tr-xl" minH="125" maxH="125" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[1].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                            <Image className="rounded-br-xl" minH="125" maxH="125" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[2].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                          </>
                                        }
                                        {journey.destinations[0].destinations[2] === undefined &&
                                          <>
                                            <Image className="rounded-r-xl" minH="250" maxH="250" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[1].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                          </>
                                        }
                                      </div>
                                    </>
                                  </div>
                                }
                                <CardBody>
                                  <Stack spacing='3'>
                                    <div className="flex flex-row justify-between pt-5">
                                      <Text noOfLines={1} fontSize='xl' className="font-bold text-left">{journey.journey_name}</Text>
                                      <div className="flex flex-row items-center">
                                        <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7' }}/>
                                        <Text fontSize='xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                                      </div>
                                    </div>
                                  </Stack>
                                </CardBody>
                              </Card>
                            </Link>
                          </div>
                      </li>
                    ))}
                  </ul>
              </div>
          }

          { publicJourneys.length !== 0 &&
              <div className="font-DMSans px-10 my-3">
                  <Text className="font-medium text-lg">Your Public Journeys</Text>
                  <ul>
                    {publicJourneys.map((journey) => (
                      <li key={journey.id}>
                          <div className="grid place-items-start font-DMSans">
                            <Link href={`/journeys/${encodeURIComponent(journey.id)}`}>
                              <Card minW={'xs'} maxW={'xs'} className = "my-5 shadow-none" overflow="hidden" variant="unstyled">
                                {journey.destinations[0].destinations[1] === undefined &&
                                  <Image className="rounded-xl" minH="250" maxH="250" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                }
                                {journey.destinations[0].destinations[1] !== undefined &&
                                  <div className="grid grid-cols-5 max-h-full rounded-xl">
                                    <>
                                      <Image className="col-span-3 rounded-l-xl" minH="250" maxH="250" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                      <div className="col-span-2">
                                        {journey.destinations[0].destinations[2] !== undefined &&
                                          <>
                                            <Image className="rounded-tr-xl" minH="125" maxH="125" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[1].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                            <Image className="rounded-br-xl" minH="125" maxH="125" minW="100%" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[2].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                          </>
                                        }
                                        {journey.destinations[0].destinations[2] === undefined &&
                                          <>
                                            <Image className="rounded-r-xl" minH="250" maxH="250" objectFit='cover' src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${journey.destinations[0].destinations[1].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='image'/>
                                          </>
                                        }
                                      </div>
                                    </>
                                  </div>
                                }
                                <CardBody>
                                  <Stack spacing='3'>
                                    <div className="flex flex-row justify-between pt-5">
                                      <Text noOfLines={1} fontSize='xl' className="font-bold text-left">{journey.journey_name}</Text>
                                      <div className="flex flex-row items-center">
                                        <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7' }}/>
                                        <Text fontSize='xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                                      </div>
                                    </div>
                                  </Stack>
                                </CardBody>
                              </Card>
                            </Link>
                          </div>
                      </li>
                    ))}
                  </ul>
              </div>
          }

          { privateJourneys.length === 0 && publicJourneys.length === 0 &&
              <div className="justify-center px-auto mx-auto mb-5">
                  <span className='font-DMSans font-regular text-sm mb-5' style = {{ color: 'gray' }}>You haven&apos;t created any Journeys yet. </span>
                  <button onClick={() => { router.push('/creation') }}className='font-DMSans font-regular text-sm mb-5' style = {{ color: '#268DC7' }}>Create one now</button>
              </div>
          }

          <Footer />
      </div>
    )
  }
}

export default Profile
