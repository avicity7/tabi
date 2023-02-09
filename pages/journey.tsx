import { useState } from 'react'
import { useRouter } from "next/router";
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup, Skeleton,SkeletonText } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass, ArrowLeft } from "phosphor-react";
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const Journey = ({data}) => {
    const router = useRouter();
    const [currentUser,setUser] = useState({})
    const user = useUser();

    const pushToUserPage = (e: React.MouseEvent<HTMLElement>) => {
        if (currentUser == null) {
          router.push('/signup')
        }
        else { 
          router.push('/profile')
        }
    }
    return(
        <div className="isolate bg-white">
            <header className="sticky top-0 z-10 px-2 py-4 bg-white">
                <div className="flex h-[5vh] items-center justify-between px-5" aria-label="Global">
                    <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="font-DMSans font-bold text-3xl">tabi</span>
                        <span className="font-DMSans text-xs ml-1">alpha</span>
                    </Link>
                    </div>
                    <button className='flex min-w-0 flex-1 justify-end px-5'>
                    <MagnifyingGlass size = "26"></MagnifyingGlass>
                    </button>
                    <div>
                        <button onClick={pushToUserPage}>
                            <span>{user != null? <Avatar name = {(user as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="grid place-items-center font-DMSans">
                <Stack className="flex max-w-2xl">
                    <div className = "relative">
                        <button className="absolute top-0 w-8 h-8 rounded-full bg-white shadow-md mx-5 my-5" onClick={() => {router.push('/')}}>
                            <ArrowLeft color="black" size="18" className = "mx-auto"/>
                        </button>
                        <Image className="max-h-80" borderRadius = {{base:"0",md:"lg"}} src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                    </div>
                    <Text className="font-bold text-2xl pt-3 px-5 md:px-0 ">{data.journey_name}</Text>
                    <Text className="font-bold text-lg pt-5 px-5 md:px-0">About this Journey</Text>
                    <Text className="font-sm md:font-regular text-regular pt-2 justify-start display-linebreak px-5 md:px-0">{data.journey_body.replace('<br/>', '\n')}</Text>
                    <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Destinations in this Journey</Text>
                    <div className ="px-5 md:px-0">
                        <Skeleton height="200" />
                    </div>
                    <Text className="font-bold text-lg pt-5 justify-start px-5 md:px-0">Comments</Text>
                    <SkeletonText className = "px-5 md:px-0" mt='10' noOfLines={20} spacing='4' skeletonHeight='2'/>
                </Stack>
            </div>
            
        </div>
    ) 
}

export async function getServerSideProps(ctx) {
    const supabase = createServerSupabaseClient(ctx)
    const { data, error } = await supabase
    .from('journeys')
    .select()
    .eq('id', ctx.query.journey_id)


    return {
        props: {
            data: data[0]
        }
    }
}

export default Journey