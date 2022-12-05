import { useState } from 'react'
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from "next/router";
import { auth } from './api/firebase-config'
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup } from '@chakra-ui/react'
import Link from 'next/link'

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

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return (
    <div className="isolate bg-white">
      <div className="px-6 pt-6 lg:px-8 sm:px-2 sticky top-0">
          <nav className="flex h-[5vh] items-center justify-between" aria-label="Global">
            <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="font-DMSans font-bold text-4xl">tabi</span>
              </a>
            </div>
            <div className="flex min-w-0 flex-1 justify-end">
                <button onClick={pushToUserPage}>
                  <span>{currentUser != null? (currentUser as any).email : <Avatar size = "sm"/>}</span>
                </button>
            </div>
          </nav>
      </div>

      <div className="grid place-items-center h-[80vh] ">
        <Card maxW='xl' className = "my-5">
          <CardBody>
            <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>Living room Sofa</Heading>
              <Text>
                This sofa is perfect for modern tropical spaces, baroque inspired
                spaces, earthy toned spaces and for people who love a chic design with a
                sprinkle of vintage design.
              </Text>
              <Text color='blue.600' fontSize='2xl'>
                $450
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='solid' colorScheme='blue'>
                Buy now
              </Button>
              <Button variant='ghost' colorScheme='blue'>
                Add to cart
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}


export default Home