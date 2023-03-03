import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { Stack, Image, Text, Skeleton, SkeletonText} from '@chakra-ui/react'
import { ArrowLeft } from "phosphor-react";
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@supabase/auth-helpers-react';
import { Icon } from '@iconify-icon/react';
import { useDisclosure } from '@chakra-ui/react';

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';

const Journey = () => {
    const router = useRouter();
    const [currentUser,setUser] = useState({});
    const user = useUser();
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
    const [data, setData] = useState({journey:'' as any,comments:'' as any})

    useEffect(()=>{
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const fetchData = async() => {
            const { data:journey, error:journeyError } = await supabase
            .from('publicJourneys')
            .select()
            .eq('id', router.query.journey_id)

            //Get comments of the journey
            const { data:comments, error:commentsError } = await supabase
            .from('comments')
            .select()
            .eq('journey_id', router.query.journey_id)

            try{
                setData({journey:journey[0], comments:comments})
            }
            catch{
                
            }
        }
        fetchData();
    },[])

    if (data.journey == '' || data.comments == ''){
        return(
            <div className="isolate bg-white">
                <Navbar activePage={'index'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

                <div className="grid place-items-center font-DMSans">
                    <Stack className="flex max-w-4xl">
                        <div className = "relative mb-5">
                            <div className="absolute top-0 mx-5">
                                <BackButton onClick={()=>{router.push('/')}}/>
                            </div>
                            <Image className="object-cover min-w-160" borderRadius = {{base:"0",md:"lg"}} src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                        </div>
                        <div className="px-5"> 
                            <Skeleton height='40px'/>
                        </div>
                        <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                        <div className="px-5">
                            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                        </div>
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
    }
    else {
        return(
            <div className="isolate bg-white">
                <Navbar activePage={'index'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

                <div className="grid place-items-center font-DMSans">
                    <Stack className="flex max-w-4xl">
                        <div className = "relative mb-5">
                            <div className="absolute top-0 mx-5">
                                <BackButton onClick={()=>{router.push('/')}}/>
                            </div>
                            <div className="bg-red-400">
                                <Image className="object-fill h-[80%] w-[100%]" borderRadius = "lg" src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='Journey Image'/>
                            </div>
                        </div>
                        <Text className="font-bold text-2xl px-5 md:px-0 ">{data.journey.journey_name}</Text>
                        <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                        <Text className="font-sm md:font-regular text-regular pt-2 justify-start display-linebreak px-5 md:px-0">{data.journey.journey_body.replace('<br/>', '\n')}</Text>
                        <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Destinations in this Journey</Text>
                        <div className ="px-5 md:px-0">
                            <Skeleton height="200" />
                        </div>
                        <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Comments</Text>
                        <ul className="pb-20">
                            {data.comments.map((comment) => (
                                <li key="{comment}">
                                    <div className="font-DMSans px-5 md:px-0">
                                        <Text className='font-medium text-md'>{comment.author_id}</Text>
                                        <Text>{comment.comment_body}</Text>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Stack>
                </div>
            </div>
        ) 
    }
}

export default Journey