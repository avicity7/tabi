import { useState, useRef } from 'react'
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from "next/router";
import { auth } from './api/firebase-config'
import { Avatar, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, AlertDialogCloseButton,Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass,ArrowLeft } from "phosphor-react";
const Profile = (user) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
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

    const logout = async (e: React.MouseEvent<HTMLElement>) => {
        await signOut(auth);
    };

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

        <div className="grid place-items-center">
            <Stack>
                <button className="w-8 h-8 rounded-full bg-white shadow-md mx-5 my-5" onClick={() => {router.push('/')}}>
                    <ArrowLeft color="black" size="18" className = "mx-auto"/>
                </button>
                <div className="justify-center px-auto">
                    <Avatar name = {currentUser != null? (currentUser as any).email: ""} size = "xl" />
                </div>
                <div className="min-w-0 flex-1 justify-center">
                    <span className='font-DMSans text-2xl'>{currentUser != null? (currentUser as any).email : <span>Not logged in</span>}</span>
                </div>
                    <Button backgroundColor="#268DC7" color="white" onClick={logout}>Sign out</Button>
            </Stack>
        </div>
    </div>
    )
}


export default Profile