import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Stack, Image, Text, Skeleton, SkeletonText, Avatar, Input } from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getCookie, setCookie } from 'cookies-next'

import Navbar from '../components/navbar'
import BackButton from '../components/backButton'
import getUsername from '../utils/getUsername'
import Footer from '../components/footer'
import MapPreview from '../components/mapPreview'
import EditButton from '../components/editButton'
import HeartButton from '../components/heartButton'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')

const createComment = async (commentBody, username, journeyId) => {
  const { error } = await supabase
    .from('comments')
    .insert({ comment_body: commentBody, journey_id: journeyId, author_username: username })
  if (error) {
    console.log(error)
  }
}

const Journey = (props) => {
  const router = useRouter()
  const [username, setUsername] = useState(props.username !== undefined ? props.username : '')
  const [userId, setUserId] = useState('')
  const [data, setData] = useState({ journey: '' as any, comments: '' as any })
  const [comment, setComment] = useState('')
  const [refresh, setRefresh] = useState(false)
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const fetchJourney = async () => {
      const user = await supabaseClient.auth.getUser()

      let fetchedUsername = null
      if (user.data.user !== null) {
        fetchedUsername = await getUsername(user.data.user.id)
        setUserId(user.data.user.id)
      }

      if (!router.isReady) return
      const { data: journey } = await supabase
        .from('journeys')
        .select()
        .eq('id', router.query.journeyId)

      // Get comments of the journey
      const { data: comments } = await supabase
        .from('comments')
        .select()
        .eq('journey_id', router.query.journeyId)

      if (fetchedUsername !== username) {
        setUsername(fetchedUsername)
      }
      if (getCookie('username') === undefined) {
        setCookie('username', fetchedUsername)
      }
      setData({ journey: journey[0], comments })
      console.log(journey)
    }

    fetchJourney()
  }, [router.query.journey_id, router.isReady, refresh])

  if (data.journey === '' || data.comments === '') {
    return (
      <div className="bg-white">
          <Navbar activePage={'index'} username={username}/>

          <div className="grid place-items-center font-DMSans">
              <Stack className="w-5/6">
                  <div className = "relative mb-5">
                      <div className="absolute top-0 mx-5">
                          <BackButton onClick={() => { router.push('/') }}/>
                      </div>
                      <div>
                          <Skeleton height="25vh" width="100%"/>
                      </div>
                  </div>
                  <Skeleton height='40px'/>
                  <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                  <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Destinations in this Journey</Text>
                  <div className ="px-5 md:px-0">
                      <Skeleton height="200" />
                  </div>
                  <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Comments</Text>
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
              </Stack>
          </div>
      </div>
    )
  } else {
    return (
      <div>
          <Navbar activePage={'index'} username={username}/>

          <div className="grid place-items-center font-DMSans">
              <Stack className="w-full lg:w-5/6">
                  <div className = "relative mb-5">
                      <div className="absolute top-0 mx-5">
                          <BackButton onClick={() => { router.push('/') }}/>
                      </div>
                      <div>
                          <Image className="min-w-full max-h-[25vh]" objectFit="cover" overflow="hidden" borderRadius = "lg" src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${data.journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='Journey Image'/>
                      </div>
                      <div className="flex flex-row absolute top-0 right-0 mx-5">
                        <HeartButton onClick={() => {}}/>
                        { data.journey.user_id === userId &&
                          <EditButton onClick={() => {
                            router.push({
                              pathname: '/editJourney',
                              query: { journeyId: data.journey.id }
                            })
                          }}/>
                        }
                      </div>
                  </div>
                  <Text className="font-bold text-2xl px-5 md:px-0 ">{data.journey.journey_name}</Text>
                  <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                  { data.journey.journey_body === null &&
                    <Text className="font-sm font-regular text-gray-400 pt-2 justify-start display-linebreak px-5 md:px-0">The author of this Journey has yet to add a description.</Text>
                  }
                  { data.journey.journey_body !== null &&
                    <Text className="font-sm font-regular pt-2 justify-start display-linebreak px-5 md:px-0">{data.journey.journey_body.replace('<br/>', '\n')}</Text>
                  }
                  <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0 pb-2">Destinations in this Journey</Text>
                  <div className ="px-3 lg:px-0">
                      <div className="rounded-lg overflow-hidden">
                       <MapPreview journeyDays={data.journey.destinations}/>
                      </div>
                  </div>
                  <button
                    onClick={ () => {
                      router.push({
                        pathname: '/journeyDetails',
                        query: { journeyId: data.journey.id }
                      })
                    }}
                    className="flex justify-center pt-3"
                  >
                    <Text className="font-medium text-tabiBlue hover:text-tabiBlueDark text-sm ">See All Destinations</Text>
                  </button>
                  <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0 py-2">Comments</Text>
                  <ul className="pb-10">
                      {data.comments.map((comment) => (
                          <li key="{comment}">
                              <div className="flex items-center font-DMSans px-5 md:px-0 mb-2">
                                  <div className='mr-2 mb-1'>
                                      <Avatar name = {comment.author_username} size = "xs" />
                                  </div>
                                  <div>
                                      <Text className='font-semibold text-sm ml-1'>{comment.author_username}</Text>
                                      <Text className="ml-1">{comment.comment_body}</Text>
                                  </div>
                              </div>
                          </li>
                      ))}
                  </ul>
                  <div className="flex flex-row pb-20">
                    <form onSubmit={() => {
                      createComment(comment, username, data.journey.id)
                      setRefresh(!refresh)
                    }}>
                      <Input className="ml-5" placeholder="Enter a comment" onChange={(e) => { setComment(e.target.value) }}/>

                      <button onClick={ () => {
                        createComment(comment, username, data.journey.id)
                        setRefresh(!refresh)
                      }}>
                      <Text className="bg-tabiBlue hover:bg-tabiBlueDark rounded-full mx-4 px-5 py-0.5 text-white text-md font-medium">Post</Text>
                      </button>
                    </form>
                  </div>
              </Stack>
          </div>

          <Footer />
      </div>
    )
  }
}

export const getServerSideProps = ({ req, res }) => {
  const username = getCookie('username', { req, res }) !== undefined ? getCookie('username', { req, res }) : null

  return { props: { username } }
}

export default Journey
