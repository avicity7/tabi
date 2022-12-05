import { useState } from 'react'
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from "next/router";
import { auth } from './api/firebase-config'
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup, Skeleton,SkeletonText } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass, ArrowLeft } from "phosphor-react";

const Journey = () => {
    const router = useRouter();
    const [currentUser,setUser] = useState({})
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
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
                        <span className="font-DMSans font-bold text-4xl">tabi</span>
                    </Link>
                    </div>
                    <button className='flex min-w-0 flex-1 justify-end px-5'>
                    <MagnifyingGlass size = "26"></MagnifyingGlass>
                    </button>
                    <div>
                        <button onClick={pushToUserPage}>
                            <span>{currentUser != null? <Avatar name = {(currentUser as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="grid place-items-center font-DMSans">
                <Stack className="flex">
                    <div className = "relative">
                        <button className="absolute top-0 w-8 h-8 rounded-full bg-white shadow-md mx-5 my-5" onClick={() => {router.push('/')}}>
                            <ArrowLeft color="black" size="18" className = "mx-auto"/>
                        </button>
                        <Image className="max-h-80" borderRadius = {{base:"0",md:"lg"}} src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                    </div>
                    <Text className="font-bold text-2xl py-3 px-5 justify-start">Journey Name</Text>
                    <Text className="font-bold text-xl py-3 px-5 justify-start">About this Journey</Text>
                    <SkeletonText mt='10' noOfLines={20} spacing='4' skeletonHeight='2' className='px-5 whitespace-normals'/>
                    <Text className="font-bold text-xl py-3 px-5 justify-start">Destinations in this Journey</Text>
                    <div className='px-5'>
                        <Skeleton height="200" />
                    </div>
                    <Text className="font-bold text-xl py-3 px-5 justify-start">Comments</Text>
                    <SkeletonText mt='10' noOfLines={20} spacing='4' skeletonHeight='2' className='px-5'/>
                </Stack>
            </div>
            
        </div>
    ) 
}

export default Journey