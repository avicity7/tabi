import { useState } from 'react'
import { useRouter } from "next/router";
import { Avatar, Stack, Text, Button } from '@chakra-ui/react'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import { 
  Show, 
  Hide, 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react'

const Navbar = ({activePage, user, router, onOpenDrawer, onCloseDrawer, isOpenDrawer, onOpenSearch, isOpenSearch, onCloseSearch}) =>{
    return(
        <header className="sticky top-0 z-10 px-2 py-4 bg-white">
          <div className="flex h-[5vh] items-center justify-between px-5">
            <Hide below="md">
              <div className="flex align-middle">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="font-DMSans font-bold text-3xl">tabi</span>
                  <span className="font-DMSans text-xs ml-1 text-tabiBlue">alpha</span>
                </Link>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-DMSans">
                  <button onClick={()=>{router.push('/')}}>
                    <div className="flex flex-row items-center">
                      <Icon height="18" icon="akar-icons:map" style={{color:activePage=="index"?'#268DC7':'#CBCBCB'}} />
                      <Text fontSize='md' className="font-medium text-left pl-2" style={{color:activePage=="index"?'#268DC7':'#CBCBCB'}}>Journeys</Text>
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
            </Hide>
            <Show below="md">
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
                        <span className="font-DMSans text-xs ml-1 text-tabiBlue">alpha</span>
                      </Link>
                    </div>
                  </DrawerHeader>
                  <DrawerBody>
                    <Stack>
                      <button onClick={()=>{router.push('/')}}>
                        <div className="flex flex-row items-center font-DMSans">
                          <Icon height="24" icon="akar-icons:map" style={{color:activePage=="index"?'#268DC7':'#CBCBCB'}} />
                          <Text fontSize='md' className="font-medium text-left pl-2" style={{color:activePage=="index"?'#268DC7':'#CBCBCB'}}>Journeys</Text>
                          <Text></Text>
                        </div>
                      </button>
                      <button>
                        <div className="flex flex-row items-center pt-5 font-DMSans">
                          <Icon height="24" icon="tabler:messages" style={{color:'#CBCBCB'}} />
                          <Text fontSize='md' className="font-medium text-left pl-2" style={{color:'#CBCBCB'}}>Social</Text>
                          <Text></Text>
                        </div>
                      </button>
                    </Stack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Show>
            <Show below="md">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-DMSans flex lg:min-w-0 lg:flex-1 align-middle">
                <Link href="/" className="-m-1.5 p-1.5">
                    <span className="font-DMSans font-bold text-3xl">tabi</span>
                    <span className="font-DMSans text-xs ml-1 text-tabiBlue">alpha</span>
                </Link>
              </div>
            </Show>
            <button onClick={onOpenSearch} className='flex min-w-0 flex-1 justify-end px-5'>
              <SearchRoundedIcon/>
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
                <button onClick={()=>{router.push('/profile')}}>
                  <span>{user != null? <Avatar name = {(user as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                </button>
            </div>
          </div>
      </header>
    )
}

export default Navbar