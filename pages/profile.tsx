import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Icon } from '@iconify-icon/react'
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
                            { privateJourneys.map((privateJourney) => (
                                <li key={privateJourney.id}>
                                    <button onClick={() => {
                                      router.push({
                                        pathname: '/journey',
                                        query: { journeyId: privateJourney.id }
                                      })
                                    }}>
                                        <Card borderRadius="lg" minW='xs' maxW='xs' className = "my-5 shadow-md" overflow="hidden">
                                        <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                                        <CardBody>
                                            <Stack spacing='3'>
                                            <div className="flex flex-row justify-between">
                                                <Text fontSize='2xl' className="font-bold text-left">{privateJourney.journey_name}</Text>
                                                <div className="flex flex-row items-center">
                                                <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7' }}/>
                                                <Text fontSize='xl' className="font-bold text-left pl-1">{privateJourney.journey_upvotes}</Text>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center">
                                                <Icon icon="charm:person" style={{ color: '#CBCBCB' }} />
                                                <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{ color: '#CBCBCB' }}>{privateJourney.author_username}</Text>
                                            </div>
                                            <Text fontSize='md' className="font-regular text-left" color="black">{privateJourney.journey_summary}</Text>
                                            </Stack>
                                        </CardBody>

                                        </Card>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                { publicJourneys.length !== 0 &&
                    <div className="font-DMSans px-10 my-3">
                        <Text className="font-medium text-lg">Your Public Journeys</Text>
                        <ul>
                            { publicJourneys.map((publicJourney) => (
                                <li key={publicJourney.id}>
                                    <button onClick={() => {
                                      router.push({
                                        pathname: '/journey',
                                        query: { journeyId: publicJourney.id }
                                      })
                                    }}>
                                        <Card borderRadius="lg" minW='xs' maxW='xs' className = "my-5 shadow-md" overflow="hidden">
                                        <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                                        <CardBody>
                                            <Stack spacing='3'>
                                            <div className="flex flex-row justify-between">
                                                <Text fontSize='2xl' className="font-bold text-left">{publicJourney.journey_name}</Text>
                                                <div className="flex flex-row items-center">
                                                <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7' }}/>
                                                <Text fontSize='xl' className="font-bold text-left pl-1">{publicJourney.journey_upvotes}</Text>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center">
                                                <Icon icon="charm:person" style={{ color: '#CBCBCB' }} />
                                                <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{ color: '#CBCBCB' }}>{publicJourney.author_username}</Text>
                                            </div>
                                            <Text fontSize='md' className="font-regular text-left" color="black">{publicJourney.journey_summary}</Text>
                                            </Stack>
                                        </CardBody>

                                        </Card>
                                    </button>
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

export const getServerSideProps = ({ req, res }) => {
  const username = getCookie('username', { req, res }) !== undefined ? getCookie('username', { req, res }) : null

  return { props: { username } }
}

export default Profile
