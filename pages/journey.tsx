import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { Stack, Image, Text, Skeleton, SkeletonText} from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Navbar from '../components/navbar';
import BackButton from '../components/backButton';
import getUsername from '../utils/getUsername';

const Journey = (props) => {
    const router = useRouter();
    const username = props.username;
    const [data, setData] = useState({journey:'' as any,comments:'' as any})

    useEffect(()=>{
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const fetchData = async() => {
            if(!router.isReady) return;
            const { data:journey, error:journeyError } = await supabase
            .from('publicJourneys')
            .select()
            .eq('id', router.query.journey_id)

            //Get comments of the journey
            const { data:comments, error:commentsError } = await supabase
            .from('comments')
            .select()
            .eq('journey_id', router.query.journey_id)

            
            setData({journey:journey[0], comments:comments})
            
            
        }
        fetchData();
        console.log('fetching')
    },[router.query.journey_id, router.isReady])

    if (data.journey == '' || data.comments == ''){
        return(
            <div className="isolate bg-white">
                <Navbar activePage={'index'} username={username}/>

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
                <Navbar activePage={'index'} username={username}/>

                <div className="grid place-items-center font-DMSans">
                    <Stack className="flex max-w-4xl">
                        <div className = "relative mb-5">
                            <div className="absolute top-0 mx-5">
                                <BackButton onClick={()=>{router.push('/')}}/>
                            </div>
                            <div className="bg-red-400">
                                <Image fit="cover" borderRadius = "lg" src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='Journey Image'/>
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

export default Journey