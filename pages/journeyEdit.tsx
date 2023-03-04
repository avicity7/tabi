import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useDisclosure, Input, Stack, Spinner, Text } from '@chakra-ui/react';
import React from 'react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';
import getUsername from '../utils/getUsername';

const JourneyEdit= (props) => { 
    const router = useRouter();
    const username = props.username;
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure()

    const Map = React.useMemo(() => dynamic(
        () => import('../components/map'),
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

    return(
        <div className="isolate bg-white">
            <Navbar activePage={'journeyedit'} username={username}/>

            <div className="grid grid-cols-3">
                    <Stack className="col-span-1 ml-4 mt-4">
                        <Stack className='mb-5'>
                            <Text className="font-DMSans font-bold text-xl ml-1">Journey Details</Text>
                            <BackButton onClick={()=>{router.push('/')}}/>
                            
                        </Stack>
                        <Text className="font-DMSans font-medium text-lg mx-5">Journey Name</Text>
                        <Input />
                    </Stack>
                    <div className="col-span-2 ml-4 rounded-xl overflow-hidden mt-4 mr-2">
                        <Map />
                    </div>
            </div>

        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);

    const { data: { session } } = await supabase.auth.getSession();

    const fetchUsername = async() => {
        let result = ""

        const fetchedUsername = await getUsername(session.user.email)

        if (fetchedUsername != undefined ) {
            return fetchedUsername
        }

    } 
  
    const username = await fetchUsername();

    return {
        props: {
        username: username
        },
    }
}

export default JourneyEdit