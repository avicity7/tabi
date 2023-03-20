import { useRouter } from 'next/router'
import { Card, CardBody, Stack, Image, Text, Spinner } from '@chakra-ui/react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Icon } from '@iconify-icon/react'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import Navbar from '../components/navbar'
import JourneyCreateButton from '../components/journeyCreateButton'
import getUsername from '../utils/getUsername'

const Home = (props) => {
  const router = useRouter()
  const username = props.username
  const [data, setData] = useState([])

  const pushToJourney = (journeyId) => {
    router.push({
      pathname: '/journey',
      query: { journeyId }
    })
  }

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const fetchData = async () => {
      const { data: journeys } = await supabase
        .from('publicJourneys')
        .select()

      try {
        setData(journeys)
      } catch {

      }
    }
    fetchData()
    console.log('refreshing')
  }, [])

  if (data.length === 0) { // Return loading Spinner
    return (
      <div className="scrollbar">
        <Navbar activePage={'index'} username={username}/>

        <div className="flex justify-center items-center h-[91.2vh]">
            <Stack>
                <div className="flex justify-center">
                    <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                </div>
                <p className="font-DMSans font-medium">Loading Journeys...</p>
            </Stack>
        </div>

        <JourneyCreateButton />

    </div>
    )
  } else { // Show Journeys
    return (
      <div className="scrollbar">
        <Navbar activePage={'index'} username={username}/>

        <ul>
          {data.map((journey) => (
            <li key={journey.id}>
                <div className="grid place-items-center font-DMSans">
                  <button onClick={() => { pushToJourney(journey.id) }}>
                    <Card borderRadius="xl" minW={{ base: '75vw', lg: 'md' }} maxW={{ base: '75vw', lg: 'md' }} className = "my-5 mx-5 shadow-md" overflow="hidden">
                      <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                      <CardBody>
                        <Stack spacing='3'>
                          <div className="flex flex-row justify-between">
                            <Text fontSize='2xl' className="font-bold text-left">{journey.journey_name}</Text>
                            <div className="flex flex-row items-center">
                              <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7' }}/>
                              <Text fontSize='xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                            </div>
                          </div>
                          <div className="flex flex-row items-center">
                            <Icon icon="charm:person" style={{ color: '#CBCBCB' }} />
                            <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{ color: '#CBCBCB' }}>{journey.author_username}</Text>
                          </div>
                          <Text fontSize='md' className="font-regular text-left" color="black">{journey.journey_summary}</Text>
                        </Stack>
                      </CardBody>

                    </Card>
                  </button>
                </div>
            </li>
          ))}
        </ul>
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

export default Home
