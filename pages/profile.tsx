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
    const logout = async () => {
    await signOut(auth);
    };
    const pushToUserPage = (e: React.MouseEvent<HTMLElement>) => {
    if (currentUser == null) {
        router.push('/signup')
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
            </nav>
        </div>

        <div className="grid place-items-center h-[80vh] ">
        <div className="flex min-w-0 flex-1 justify-center">
            <span>{currentUser != null? (currentUser as any).email : <Avatar size = "xl"/>}</span>
        </div>
            <Button backgroundColor="#268DC7" color="white" onClick={onOpen}>Sign out</Button>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    Are you sure you want to discard all of your notes? 44 words will be
                    deleted.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                    No
                    </Button>
                    <Button colorScheme='red' ml={3}>
                    Yes
                    </Button>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
    )
}


export default Profile