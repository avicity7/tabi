import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { getCookie, setCookie } from 'cookies-next'
import { Card, CardBody, Stack, Image, Text, Spinner } from '@chakra-ui/react'
import Head from 'next/head'
import { Icon } from '@iconify-icon/react'
import Link from 'next/link'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useRouter } from 'next/router'

import getUsername from '../utils/getUsername'
import Navbar from '../components/navbar'

const Search = (props) => {
  const [username, setUsername] = useState(props.username !== undefined ? props.username : '')
  const [noResults, setNoResults] = useState(false)
  const [data, setData] = useState([])
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const fetchData = async () => {
      const user = await supabaseClient.auth.getUser()
      let fetchedUsername = null
      if (user.data.user !== null) {
        fetchedUsername = await getUsername(user.data.user.id)
      }

      const { data: journeys } = await supabase
        .from('journeys')
        .select()
        .eq('public', true)

      try {
        if (fetchedUsername !== username) {
          setUsername(fetchedUsername)
        }
        if (getCookie('username') === undefined) {
          setCookie('username', fetchedUsername)
        }

        const temp = []
        for (let i = 0; i < journeys.length; i++) {
          if (journeys[i].journey_name.toLowerCase().includes(String(router.query.searchInput).toLowerCase())) {
            temp.push(journeys[i])
          }
        }
        if (temp.length !== 0) {
          setData(temp)
        } else {
          setNoResults(true)
        }
      } catch {

      }
    }
    if (router.isReady) fetchData()
  }, [router.isReady])

  if (data.length === 0 && !noResults) { // Return loading Spinner
    return (
      <div className="scrollbar">
        <Head>
          <title>Search | tabi</title>
        </Head>

        <Navbar activePage={'index'} />

        <div className="flex justify-center items-center h-[91.2vh]">
            <Stack>
                <div className="flex justify-center">
                    <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                </div>
                <p className="font-DMSans font-medium">Searching...</p>
            </Stack>
        </div>
    </div>
    )
  } else if (noResults) {
    return (
      <div className="scrollbar">
        <Head>
          <title>Search | tabi</title>
        </Head>

        <Navbar activePage={'index'} />

        <div className="flex justify-center items-center h-[91.2vh]">
            <Stack className="flex items-center font-DMSans mb-5">
                <p className="font-DMSans font-medium">No Journeys found with the name:</p>
                <Text className="text-xl font-bold">{ router.query.searchInput }</Text>
            </Stack>
        </div>
    </div>
    )
  } else if (data.length !== 0) { // Show Journeys
    return (
      <div className="scrollbar">
        <Head>
          <title>Search | tabi</title>
        </Head>

        <Navbar activePage={'index'} username={username}/>

        <Stack className="flex items-center font-DMSans mb-5">
          <Text>Search results for</Text>
          <Text className="text-lg font-bold">{ router.query.searchInput }</Text>
          <Text className="text-lg font-bold text-gray-400">. . .</Text>
        </Stack>

        <ul>
          {data.map((journey) => (
            <li key={journey.id}>
                <div className="grid place-items-center font-DMSans">
                  <Link href={`/journeys/${encodeURIComponent(journey.id)}`}>
                    <Card minW={{ base: '85vw', lg: 'md' }} maxW={{ base: '85vw', lg: 'md' }} className = "my-5 mx-5 shadow-none" overflow="hidden" variant="unstyled">
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
                          <div className="flex flex-row items-center">
                            <Icon icon="charm:person" style={{ color: '#CBCBCB' }} />
                            <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{ color: '#CBCBCB' }}>{journey.author_username}</Text>
                          </div>
                          {/* <Text fontSize='md' className="font-regular text-left" color="black">{journey.journey_summary}</Text> */}
                        </Stack>
                      </CardBody>
                    </Card>
                  </Link>
                </div>
            </li>
          ))}
        </ul>
    </div>
    )
  }
}

export default Search
