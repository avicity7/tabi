import { useState } from 'react'
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from "next/router";
import { auth } from './api/firebase-config'
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup, Skeleton,SkeletonText } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass } from "phosphor-react";

const Home = (user) => {
  const router = useRouter();
  const [currentUser,setUser] = useState({})
  const pushToUserPage = (e: React.MouseEvent<HTMLElement>) => {
    if (currentUser == null) {
      router.push('/signup')
    }
    else { 
      router.push('/profile')
    }
  }
  const pushToJourney = (e: React.MouseEvent<HTMLElement>) => {
    router.push('/journey')
  }

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return (
    <div className="isolate bg-white">
      <header className="sticky top-0 z-10 px-2 py-4 bg-white">
          <div className="flex h-[5vh] items-center justify-between px-5" aria-label="Global">
            <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="font-DMSans font-bold text-4xl">tabi</span>
                <span className="font-DMSans text-xs ml-1">alpha</span>
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

      <div className="grid place-items-center h-[80vh] font-DMSans">
        <button onClick={pushToJourney}>
          <Card maxW={{base: 'sm',md: 'xl'}} className = "my-5 mx-5" overflow="hidden">
            <Image objectFit='cover' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
            <CardBody>
              <Stack spacing='5'>
                <Text fontSize='2xl' className="font-bold text-left">Journey Name</Text>
                <SkeletonText mt='10' noOfLines={4} spacing='4' skeletonHeight='2' />
              </Stack>
            </CardBody>
            
          </Card>
        </button>
        <button onClick={pushToJourney}>
          <Card maxW={{base: 'sm',md: 'xl'}} className = "my-5 mx-5" overflow="hidden">
            <Image objectFit='cover' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
            <CardBody>
              <Stack spacing='5'>
                <Text fontSize='2xl' className="font-bold text-left">Journey Name</Text>
                <SkeletonText mt='10' noOfLines={4} spacing='4' skeletonHeight='2' />
              </Stack>
            </CardBody>
            
          </Card>
        </button>
        <button onClick={pushToJourney}>
          <Card maxW={{base: 'sm',md: 'xl'}} className = "my-5 mx-5" overflow="hidden">
            <Image objectFit='cover' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
            <CardBody>
              <Stack spacing='5'>
                <Text fontSize='2xl' className="font-bold text-left">Journey Name</Text>
                <SkeletonText mt='10' noOfLines={4} spacing='4' skeletonHeight='2' />
              </Stack>
            </CardBody>
            
          </Card>
        </button>

      </div>
      <div className = "fixed bottom-0 w-screen flex justify-end px-10 py-10">
        <button className="w-12 h-12 rounded-full bg-white hover:bg-white shadow-md">
              <PencilSimple color="#268DC7" size="26" className = "mx-auto"/>
        </button>
      </div>

    </div>
  )
}


export default Home