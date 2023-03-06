import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useDisclosure, Input, Stack, Spinner, Text, Textarea } from '@chakra-ui/react';
import React from 'react'
import dynamic from 'next/dynamic'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';
import getUsername from '../utils/getUsername';
import SearchInput from '../components/searchInput';
import Search from 'antd/es/transfer/search';

const JourneyEdit= (props) => { 
    const router = useRouter();
    const username = props.username;
    const [place, savePlace] = useState('');

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
                <div className="col-span-1 ml-4 mt-4">
                    <div className="flex flex-row items-center">
                        <BackButton onClick={()=>{router.push('/')}}/>
                        <Text className="font-DMSans font-bold text-xl ml-4">Journey Details</Text>
                        
                    </div>

                    <Text className="font-DMSans font-medium text-lg px-8 mb-2">Journey Name</Text>
                    <div className="px-8 pb-5">
                        <Input focusBorderColor='#268DC7'/>
                    </div>

                    <Text className="font-DMSans font-medium text-lg px-8 mb-2">Journey Description</Text>
                    <div className="px-8 pb-8">
                        <Textarea focusBorderColor='#268DC7' resize={'vertical'}/>
                    </div>

                    <div className="flex justify-center mb-6">
                        <Text className="font-DMSans font-bold text-sm text-gray-400">Destinations in this Journey</Text>
                    </div>
                
                    <Text className="font-DMSans font-medium text-lg px-8 mb-2">Destination Name</Text>
                    <div className="px-8 pb-5">
                        <SearchInput />
                    </div>
                </div>
                
                
                <div className="sticky top-[10vh] max-h-[91vh] col-span-2 rounded-xl overflow-hidden mr-2">
                    <Map />
                </div>
            </div>

        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);
    let fetchedUsername = '';

    const { data: { session } } = await supabase.auth.getSession();

    const fetchUsername = async() => {
        try {
            fetchedUsername = await getUsername(session.user.email)
            return fetchedUsername
        }
        catch {
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