import { useState } from 'react'
import { useRouter } from "next/router";
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup, Skeleton,SkeletonText } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass } from "phosphor-react";
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Icon } from '@iconify-icon/react';
import { 
  Show, 
  Hide, 
  useDisclosure, 
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const Home = ({data}) => {
  console.log(data);
  const router = useRouter();
  const supabase = useSupabaseClient()
  const user = useUser();
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure()
  const pushToUserPage = (e: React.MouseEvent<HTMLElement>) => {
      router.push('/profile')
  }

  const pushToJourney = (journey_id) => {
    router.push({
      pathname: '/journey',
      query: {journey_id: journey_id}
    })
  }

  return (
    <div className="isolate bg-white">
      
      <header className="sticky top-0 z-10 px-2 py-4 bg-white">
          <div className="flex h-[5vh] items-center justify-between px-5">
            <Show above="md">
              <div className="flex align-middle">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="font-DMSans font-bold text-3xl">tabi</span>
                  <span className="font-DMSans text-xs ml-1 text-tabiBlue">alpha</span>
                </Link>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <button>
                    <div className="flex flex-row items-center">
                      <Icon height="18" icon="akar-icons:map" style={{color:'#268DC7'}} />
                      <Text fontSize='md' className="font-medium text-left pl-2" style={{color:'#268DC7'}}>Journeys</Text>
                      <Text></Text>
                    </div>
                  </button>
                  <button>
                    <div className="flex flex-row items-center pl-5">
                      <Icon height="18" icon="tabler:messages" style={{color:'#CBCBCB'}} />
                      <Text fontSize='md' className="font-medium text-left pl-2" style={{color:'#CBCBCB'}}>Social</Text>
                      <Text></Text>
                    </div>
                  </button>
                </div>
              </div>
            </Show>
            <Hide above="md">
              <button onClick={onOpenDrawer}>
                <MenuRoundedIcon />
              </button>
              <Drawer placement={'left'} onClose={onCloseDrawer} isOpen={isOpenDrawer}>
                <DrawerOverlay />
                <DrawerContent borderRadius="md">
                  <DrawerHeader>
                    <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
                      <Link href="/" className="-m-1.5 p-1.5">
                        <span className="font-DMSans font-bold text-3xl">tabi</span>
                        <span className="font-DMSans text-xs ml-1 text-TabiBlue">alpha</span>
                      </Link>
                    </div>
                  </DrawerHeader>
                  <DrawerBody>
                    <Stack>
                      <button>
                        <div className="flex flex-row items-center">
                          <Icon height="24" icon="akar-icons:map" style={{color:'#268DC7'}} />
                          <Text fontSize='md' className="font-medium text-left pl-2" style={{color:'#268DC7'}}>Journeys</Text>
                          <Text></Text>
                        </div>
                      </button>
                      <button>
                        <div className="flex flex-row items-center pt-5">
                          <Icon height="24" icon="tabler:messages" style={{color:'#CBCBCB'}} />
                          <Text fontSize='md' className="font-medium text-left pl-2" style={{color:'#CBCBCB'}}>Social</Text>
                          <Text></Text>
                        </div>
                      </button>
                    </Stack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Hide>
            <button onClick={onOpenSearch} className='flex min-w-0 flex-1 justify-end px-5'>
              <MagnifyingGlass size = "26"></MagnifyingGlass>
            </button>
            <Modal isOpen={isOpenSearch} onClose={onCloseSearch}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader className="font-DMSans">Search for Journey</ModalHeader>
                <ModalBody className="font-DMSans">
                  <Text>Search</Text>
                </ModalBody>

                <ModalFooter className="font-DMSans">
                  <Button onClick={onCloseSearch} variant='ghost'>Cancel Search</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <div>
                <button onClick={pushToUserPage}>
                  <span>{user != null? <Avatar name = {(user as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                </button>
            </div>
          </div>
      </header>

      <ul>
        {data.map((journey) => (
          <li key="{journey}">
              <div className="grid place-items-center h-[80vh] font-DMSans">
                <button onClick={() => {pushToJourney(journey.id)}}>
                  <Card maxW={'lg'} className = "my-5 mx-5" overflow="hidden">
                    <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                    <CardBody>
                      <Stack spacing='3'>
                        <div className="flex flex-row justify-between">
                          <Text fontSize='2xl' className="font-bold text-left">{journey.journey_name}</Text>
                          <div className="flex flex-row items-center">
                            <ArrowUpwardRoundedIcon fontSize="medium" style={{ color: '#268DC7'}}/>
                            <Text fontSize='2xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <Icon icon="charm:person" style={{color:'#CBCBCB'}} />
                          <Text fontSize='xs' className="font-medium text-left pl-0.5 pt-0.3" style={{color:'#CBCBCB'}}>hiroyuki</Text>
                        </div>
                        <Text fontSize='md' className="font-regular text-left" color="black">{journey.journey_summary}</Text>
                      </Stack>
                    </CardBody>
                    
                  </Card>
                </button>
              </div>
          </li>
        ))}
      </ul>

      <div className = "fixed bottom-0 w-screen flex justify-end px-6 md:px-10 py-10">
        <button className="w-12 h-12 rounded-full bg-white hover:bg-white shadow-md">
              <PencilSimple color="#268DC7" size="26" className = "mx-auto"/>
        </button>
      </div>

      <footer className="bg-white">
        <div className="font-DMSans grid grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Company</h2>
                <ul className="text-gray-500 ">
                    <li className="mb-4">
                        <a href="#" className=" hover:underline">About</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Careers</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Brand Center</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Blog</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Help center</h2>
                <ul className="text-gray-500 ">
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Twitter</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Contact Us</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Legal</h2>
                <ul className="text-gray-500 ">
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Download</h2>
                <ul className="text-gray-500 ">
                    <li className="mb-4">
                        <a href="#" className="hover:underline">iOS</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline">Android</a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="font-DMSans px-4 py-6 bg-gray-100  md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center">© 2023 <a href="#">tabi™</a>. All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center md:mt-0">
                <a href="#" className="text-gray-400 hover:text-gray-900 ">
                    <span className="sr-only">Instagram page</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-900 ">
                    <span className="sr-only">Twitter page</span>
                </a>
            </div>
        </div>
    </footer>

  </div>
    
  )
}

export async function getServerSideProps(ctx) {
  const supabase = createServerSupabaseClient(ctx)
  let { data } = await supabase.from('journeys').select()

  return {
    props: {
     data: data
    },
  }
}


export default Home