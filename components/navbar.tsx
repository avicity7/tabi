import { useRouter } from "next/router";
import { useUser } from '@supabase/auth-helpers-react';
import { Avatar, Stack, Text, Button, Input } from '@chakra-ui/react'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { 
  Show, 
  Hide, 
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';

const Navbar = (props) =>{
  const activePage = props.activePage;
  const username = props.username;
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setSearchOpen(true);
  const handleDrawerClose = () => setSearchOpen(false);

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
            <button onClick={handleDrawerOpen}>
              <MenuRoundedIcon />
            </button>
            <Drawer placement={'left'} onClose={handleDrawerClose} isOpen={drawerOpen}>
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

          <div className='flex flex-1 justify-end px-5'>
            <button onClick={handleSearchOpen} className='min-w-0 justify-end'>
              <SearchRoundedIcon/>
            </button>
          </div>
          
          <Transition appear show={searchOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleSearchClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                      <Dialog.Title
                        as="h3"
                        className="text-lg font-bold font-DMSans"
                      >
                        Search
                      </Dialog.Title>

                      <Stack>
                        <div className="mt-5 mb-5">
                          <Input focusBorderColor='#268DC7'/>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="font-DMSans inline-flex justify-center rounded-md border border-transparent bg-tabiBlue px-4 py-2 text-sm font-medium text-white hover:bg-tabiBlueDark"
                            onClick={()=>{}}
                          >
                            Search
                          </button>
                        </div>
                      </Stack>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <div>
              <button onClick={()=>{router.push('/profile')}}>
                <span>{<Avatar name = {username} size = "sm" />}</span>
              </button>
          </div>

        </div>
    </header>
  )
}

export default Navbar