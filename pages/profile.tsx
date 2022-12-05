import { useState, useRef } from 'react'
import {onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from "next/router";
import { auth } from './api/firebase-config'
import { Avatar, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, AlertDialogCloseButton } from '@chakra-ui/react'
import Link from 'next/link'

const Profile = (user) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const router = useRouter();
    const [currentUser,setUser] = useState({})

    const logout = async (e: React.MouseEvent<HTMLElement>) => {
        await signOut(auth);
    };

    onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    });
    return (
    <div className="isolate bg-white">
        <div className="px-6 pt-6 lg:px-8 sm:px-2 sticky top-0">
            <nav className="flex h-[5vh] items-center justify-between" aria-label="Global">
            <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5">
                <span className="font-DMSans font-bold text-4xl">tabi</span>
                </Link>
            </div>
            </nav>
        </div>

        <div className="grid place-items-center h-[80vh] ">
            <div className="min-w-0 flex-1 justify-center">
                <span>{currentUser != null? <Avatar name = {(currentUser as any).email} size = "xl" /> : <Avatar size = "xl"/>}</span>
            </div>
            <div className="min-w-0 flex-1 justify-center">
                <span className='font-DMSans text-2xl'>{currentUser != null? (currentUser as any).email : <span>Not logged in</span>}</span>
            </div>
                <Button backgroundColor="#268DC7" color="white" onClick={logout}>Sign out</Button>
        </div>
    </div>
    )
}


export default Profile