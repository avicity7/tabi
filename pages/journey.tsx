import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Stack, Image, Text, Skeleton, SkeletonText, Avatar } from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import Navbar from '../components/navbar'
import BackButton from '../components/backButton'
import getUsername from '../utils/getUsername'
import Footer from '../components/footer'
import MapPreview from '../components/mapPreview'

const Journey = (props) => {
  const router = useRouter()
  const username = props.username
  const [data, setData] = useState({ journey: '' as any, comments: '' as any })

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const fetchData = async () => {
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

      setData({ journey: journey[0], comments })
    }
    fetchData()
  }, [router.query.journey_id, router.isReady])

  if (data.journey === '' || data.comments === '') {
    return (
      <div className="bg-white">
          <Navbar activePage={'index'} username={username}/>

          <div className="grid place-items-center font-DMSans">
              <Stack className="flex max-w-6xl">
                  <div className = "relative mb-5">
                      <div className="absolute top-0 mx-5">
                          <BackButton onClick={() => { router.push('/') }}/>
                      </div>
                      <div>
                          <Skeleton height="25vh" width="70rem"/>
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
      <div className="isolate bg-white">
          <Navbar activePage={'index'} username={username}/>

          <div className="grid place-items-center font-DMSans">
              <Stack className="flex min-w-6xl max-w-6xl">
                  <div className = "relative mb-5">
                      <div className="absolute top-0 mx-5">
                          <BackButton onClick={() => { router.push('/') }}/>
                      </div>
                      <div>
                          <Image className="min-w-full max-h-[25vh]" objectFit="cover" overflow="hidden" borderRadius = "lg" src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='Journey Image'/>
                      </div>
                  </div>
                  <Text className="font-bold text-2xl px-5 md:px-0 ">{data.journey.journey_name}</Text>
                  <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                  <Text className="font-sm md:font-regular text-regular pt-2 justify-start display-linebreak px-5 md:px-0">{data.journey.journey_body.replace('<br/>', '\n')}</Text>
                  <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0 pb-2">Destinations in this Journey</Text>
                  <div className ="px-5 md:px-0 rounded-lg overflow-hidden">
                      <MapPreview journeyDays={data.journey.destinations}/>
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
                  <ul className="pb-20">
                      {data.comments.map((comment) => (
                          <li key="{comment}">
                              <div className="flex items-center font-DMSans px-5 md:px-0">
                                  <div className='mr-2 mb-1'>
                                      <Avatar name = {comment.author_id} size = "xs" />
                                  </div>
                                  <div>
                                      <Text className='font-semibold text-sm ml-1 mb-0.5'>{comment.author_id}</Text>
                                      <Text className="ml-1">{comment.comment_body}</Text>
                                  </div>
                              </div>
                          </li>
                      ))}
                  </ul>
              </Stack>
          </div>

          <Footer />
      </div>
    )
  }
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  let fetchedUsername = ''

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
export default Journey
