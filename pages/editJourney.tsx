import { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/router";
import { useDisclosure, Input, Stack, Spinner, Text, Textarea } from '@chakra-ui/react';
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft } from "phosphor-react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { createClient } from '@supabase/supabase-js';

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';
import getUsername from '../utils/getUsername';
import SearchInput from '../components/searchInput';

const JourneyEdit= (props) => { 
    const router = useRouter();
    const username = props.username;
    const [viewState, setViewState] = useState({
        latitude:35.6812,
        longitude:139.7671,
        zoom: 14
    });
    const [serverData, setServerData] = useState([])
    const [userData, setUserData] = useState([])
    const [currentDay, setCurrentDay] = useState(1)
    const [refresh, setRefresh] = useState(false)

    const MapView = useMemo(() => dynamic(
        () => import('../components/mapView'),
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

    useEffect(()=>{
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const fetchData = async() => {
            if(!router.isReady) return;

            const { data, error } = await supabase
            .from('privateDestinations')
            .select()
            .eq('id', router.query.privateJourneyID)

            setServerData(data[0].destinations.days)
            if (userData.length == 0) {
                setUserData(data[0].destinations.days)
            }
            
        }
        fetchData();
    },[router.query.privateJourneyID, router.isReady, userData.length, refresh])

    if (userData.length == 0){ //Return loading Spinner
        return (
            <div className="isolate bg-white">
                <Navbar activePage={'index'} username={username}/>

                <div className="flex justify-center items-center h-[91.2vh]">
                    <Stack>
                        <div className="flex justify-center">
                            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                        </div>
                        <p className="font-DMSans font-medium">Loading Journeys...</p>
                    </Stack>
                </div>
            </div>
        )
      }
    
    else {
        return (
            <div className="isolate bg-white">
                <Navbar activePage={'journeyedit'} username={username}/>

                <div className="grid grid-cols-4">
                    <div className="col-span-2 ml-4 mt-4">
                        <div className="flex flex-row items-center">
                            <button className="my-5" onClick={()=>{router.push('/')}}>
                                <ArrowLeft color="black" size="18" className = "mx-auto" strokeWidth="5"/>
                            </button>

                            <Text className="font-DMSans font-bold text-xl ml-3.5">Journey Details</Text>
                        </div>

                        <Text className="font-DMSans font-medium text-lg px-8 mb-2">Journey Name</Text>
                        <div className="px-8 pb-5">
                            <Input focusBorderColor='#268DC7'/>
                        </div>

                        <Text className="font-DMSans font-medium text-lg px-8 mb-2">Journey Description</Text>
                        <div className="px-8 pb-8">
                            <Textarea focusBorderColor='#268DC7' resize={'vertical'}/>
                        </div>

                        <div className="grid grid-cols-9 gap-0">
                            <Stack className='col-span-2 justify-center'>
                                <ul>
                                    {userData.map((day) => (
                                        <li key={day.day}>
                                            <div className="grid place-items-center font-DMSans">
                                                {/* Set day button to Blue, no hover effect */}
                                                { day.day == currentDay &&
                                                    <button className='text-[#268DC7] transition-none'>
                                                        <p className="font-medium text-lg">
                                                            Day {day.day}
                                                        </p>
                                                    </button>
                                                }

                                                {/* NOT the current day to display, hover effect added */}
                                                { day.day != currentDay &&
                                                    <button className='text-[#CBCBCB] hover:text-[#268DC7] transition-none'>
                                                        <p className="font-medium text-lg">
                                                            Day {day.day}
                                                        </p>
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <button className='text-[#CBCBCB] hover:text-[#268DC7] transition-none' onClick={()=>{
                                    let data = userData
                                    data.push({"day": userData[userData.length - 1].day + 1, "destinations": []})
                                    setUserData(data)
                                    setRefresh(!refresh)
                                }}>
                                    <p className="font-bold text-xl">+</p>
                                </button>
                            </Stack>

                            <div className='col-span-7'>
                                <Text className="font-DMSans font-medium text-lg px-8 mb-2">Destination Name</Text>
                                <div className="px-8 pb-5">
                                    <SearchInput viewState={viewState} setViewState={setViewState}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="sticky top-[10vh] min-h-[90vh] max-h-[90vh] col-span-2 rounded-xl overflow-hidden mr-2">
                        <MapView viewState={viewState} setViewState={setViewState}/>
                    </div>
                </div>

            </div>
        )
    }
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  let fetchedUsername = '';
  let user = "";

  const { data: { session } } = await supabase.auth.getSession();

  const fetchUsername = async() => {
      try {
        fetchedUsername = await getUsername(session.user.id)
        return fetchedUsername
      }
      catch {
        return fetchedUsername
      }
  } 

  const username = await fetchUsername();

  try { 
    user = session.user.id
  }
  catch {
    
  }

  return {
      props: {
      username: username,
      user: user
      },
  }
}

export default JourneyEdit