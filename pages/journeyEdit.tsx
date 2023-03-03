import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useDisclosure, Input, Stack, Spinner, Text } from '@chakra-ui/react';
import React from 'react'
import dynamic from 'next/dynamic'

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';

const JourneyEdit= () => { 
    const router = useRouter();
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
            <Navbar activePage={'journeyedit'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

            <div className="grid grid-cols-3">
                    <Stack className="col-span-1 ml-4 mt-4">
                        <div className="flex flex-row items-center">
                            <BackButton onClick={()=>{router.push('/')}}/>
                            <Text className="font-DMSans font-bold text-xl mx-5">Journey Details</Text>
                        </div>
                        <Text className="font-DMSans font-medium text-lg mx-5">Journey Name</Text>
                        <Input />
                    </Stack>
                    <div className="col-span-2 ml-4">
                        <Map />
                    </div>
            </div>

        </div>
    )
}

export default JourneyEdit