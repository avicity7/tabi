import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Stack, Image, Text, Skeleton, SkeletonText, Avatar, Input } from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getCookie, setCookie } from 'cookies-next'
import Head from 'next/head'

import Navbar from '../../components/navbar'
import BackButton from '../../components/backButton'
import getUsername from '../../utils/getUsername'
import Footer from '../../components/footer'
import MapPreview from '../../components/mapPreview'
import EditButton from '../../components/editButton'
import HeartButton from '../../components/heartButton'
import ActionButton from '../../components/actionButton'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')

const createComment = async (commentBody, username, journeyId) => {
  const { error } = await supabase
    .from('comments')
    .insert({ comment_body: commentBody, journey_id: journeyId, author_username: username })
  if (error) {
    console.log(error)
  }
}

const Journey = ({ journey }) => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [data, setData] = useState({ journey: journey != null ? journey : '' as any, comments: '' as any })
  const [comment, setComment] = useState('')
  const [refresh, setRefresh] = useState(false)
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    setUsername(getCookie('username') as any)
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
        .eq('id', router.query.journey)

      // Get comments of the journey
      const { data: comments } = await supabase
        .from('comments')
        .select()
        .eq('journey_id', router.query.journey)

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

  return (
    <div>
      {data.journey.journey_name !== undefined &&
        <Head>
          <title>{data.journey.journey_name} | tabi</title>
        </Head>
      }

      <Navbar activePage={'index'} username={username}/>

      <div className="grid place-items-center font-DMSans">
          <Stack className="w-full lg:w-5/6">
              <div className = "relative mb-5">
                  <div className="absolute top-0 mx-5">
                      <BackButton onClick={() => { router.push('/') }}/>
                  </div>
                  <div>
                    <Skeleton height="25vh" width="100%" isLoaded={data.journey !== '' || data.comments !== ''}>
                      {(data.journey !== '' || data.comments !== '') && data.journey.destinations[0].destinations[0] !== undefined &&
                        <Image className="min-w-full max-h-[25vh]" objectFit="cover" overflow="hidden" borderRadius = "lg" src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=1000&photo_reference=${data.journey.destinations[0].destinations[0].photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`} alt='Journey Image'/>
                      }
                      {(data.journey !== '' || data.comments !== '') && data.journey.destinations[0].destinations[0] === undefined &&
                        <div className="staticrounded-xl overflow-hidden">
                          <Skeleton height="220px" speed={0}>
                          </Skeleton>
                        </div>
                      }
                    </Skeleton>
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
                    <ActionButton onClick={() => {}}/>
                  </div>
              </div>
              <Skeleton height='40px' isLoaded={data.journey !== '' || data.comments !== ''}>
                <Text className="font-bold text-2xl px-5 md:px-0 ">{data.journey.journey_name}</Text>
              </Skeleton>
              <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' isLoaded={data.journey !== '' || data.comments !== ''}>
                { data.journey.journey_body === null &&
                  <Text className="font-sm font-regular text-gray-400 pt-2 justify-start display-linebreak px-5 md:px-0">The author of this Journey has yet to add a description.</Text>
                }
                { data.journey.journey_body !== null && (data.journey !== '' || data.comments !== '') &&
                  // <Text className="font-sm font-regular pt-2 justify-start display-linebreak px-5 md:px-0">{data.journey.journey_body.replace('<br/>', '\n')}</Text>
                  <div className="pt-2 display-linebreak px-5 md:px-0 whitespace-pre-wrap">{data.journey.journey_body.replace('<br/>', '\n')}</div>
                }
              </SkeletonText>
              <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0 pb-2">Destinations in this Journey</Text>
              <div className ="px-3 lg:px-0">
                  <div className="rounded-lg">
                    <Skeleton height="max" isLoaded={data.journey !== '' || data.comments !== ''}>
                      {(data.journey !== '' || data.comments !== '') &&
                        <MapPreview journeyDays={data.journey.destinations} journeyId={data.journey.id}/>
                      }
                    </Skeleton>
                  </div>
              </div>
              <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0 py-2">Comments</Text>
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' isLoaded={data.journey !== '' || data.comments !== ''}>
                {(data.journey !== '' || data.comments !== '') &&
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
                }
              </SkeletonText>
                <form onSubmit={() => {
                  createComment(comment, username, data.journey.id)
                  setRefresh(!refresh)
                }}>
                <div className="flex flex-row pb-20">
                  <Input className="ml-5" placeholder="Enter a comment" onChange={(e) => { setComment(e.target.value) }}/>

                  <button onClick={ () => {
                    createComment(comment, username, data.journey.id)
                    setRefresh(!refresh)
                  }}>
                  <Text className="bg-tabiBlue hover:bg-tabiBlueDark rounded-full mx-4 px-5 py-0.5 text-white text-md font-medium">Post</Text>
                  </button>
                </div>
                </form>
          </Stack>
      </div>

      <Footer />
    </div>
  )
}

export default Journey
