import { useRouter } from "next/router";
import { Card, CardBody, Stack, Image, Text, Spinner, } from '@chakra-ui/react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Icon } from '@iconify-icon/react';
import { useDisclosure } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import Navbar from '../components/navbar';
import JourneyCreateButton from '../components/journeyCreateButton';

const Home = () => {
  const router = useRouter();
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const [data, setData] = useState([]);

  const pushToJourney = (journey_id) => {
    router.push({
      pathname: '/journey',
      query: {journey_id: journey_id}
    })
  }

  useEffect(()=>{
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const fetchData = async() => {
          const { data:journeys, error:journeyError } = await supabase
          .from('publicJourneys')
          .select()

          try{
              setData(journeys)
          }
          catch{
              
          }
      }
      fetchData();
  },[])

  if (data.length == 0){ //Return loading Spinner
    return (
      <div className="isolate bg-white">
        <Navbar activePage={'index'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

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
  }

  else { //Show Journeys
    return (
      <div className="isolate bg-white">
        <Navbar activePage={'index'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

        <ul>
          {data.map((journey) => (
            <li key={journey.id}>
                <div className="grid place-items-center font-DMSans">
                  <button onClick={() => {pushToJourney(journey.id)}}>
                    <Card maxW={'lg'} className = "my-5 mx-5" overflow="hidden">
                      <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                      <CardBody>
                        <Stack spacing='3'>
                          <div className="flex flex-row justify-between">
                            <Text fontSize='2xl' className="font-bold text-left">{journey.journey_name}</Text>
                            <div className="flex flex-row items-center">
                              <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7'}}/>
                              <Text fontSize='xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                            </div>
                          </div>
                          <div className="flex flex-row items-center">
                            <Icon icon="charm:person" style={{color:'#CBCBCB'}} />
                            <Text fontSize='xs' className="font-medium text-left pl-0.5 pt-0.3" style={{color:'#CBCBCB'}}>{journey.author_username}</Text>
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

        <JourneyCreateButton />
    </div>
    )
  }
}

export default Home