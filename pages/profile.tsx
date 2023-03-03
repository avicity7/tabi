import { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/router";
import { PencilSimple } from "phosphor-react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Icon } from '@iconify-icon/react';
import { 
    Text,
    Avatar,
    useDisclosure, 
    Stack
} from '@chakra-ui/react';

import Navbar from '../components/navbar';
import JourneyCreateButton from '../components/journeyCreateButton';

const Profile = () => {
    const supabase = useSupabaseClient()
    const router = useRouter();
    const user = useUser();

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const [method, setMethod] = useState('signup')

    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure()

    const logout = async (e: React.MouseEvent<HTMLElement>) => {    
        e.preventDefault();
        const { error } = await supabase.auth.signOut();
        router.push('/')
    };

    useEffect(()=>{
        console.log(user)
    },[user])

    const loginAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email, 
            password
        });
    };

    const register = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const registerEmail = (document.querySelector("#email-address") as HTMLInputElement).value;
        const registerPassword = (document.querySelector("#password") as HTMLInputElement).value;
        try { 
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          })
          if (!error){
            router.replace('/')
          }
          
          
        }
        catch {
            console.log("Error")
        }
    };
    if (!user && method == 'signup'){//signup
        return (
        <div className="flex h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="m-auto w-full max-w-md space-y-8">
                <div>
                <h1 className="mx-auto text-center font-DMSans font-bold text-4xl">tabi</h1>
                <h2 className="font-DMSans mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create a tabi account
                </h2>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md">
                    <div className = "font-DMSans">
                    <label htmlFor="email-address" className="sr-only">
                        Email address
                    </label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-tabiBlue focus:outline-none focus:ring-tabiBlue sm:text-sm"
                        placeholder="Email address"
                    />
                    </div>
                    <div className = "font-DMSans">
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-tabiBlue focus:outline-none focus:ring-tabiBlue sm:text-sm"
                        placeholder="Password"
                    />
                    </div>
                </div>
    
                <div className="flex items-center justify-center">
                    <div className="text-sm">
                    <button onClick={()=>{setMethod("login")}}className="font-DMSans font-medium text-tabiBlue hover:text-tabiBlueDark">
                        Already have an account?
                    </button>
                    </div>
    
                </div>
                <div>
                    <button
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-tabiBlue py-2 px-4 text-sm font-DMSans font-medium text-white hover:bg-tabiBlueDark focus:outline-none focus:ring-2 focus:ring-tabiBlue focus:ring-offset-2"
                    onClick = {register}
                    >
                    Sign Up
                    </button>
                </div>
                </form>
            </div>
            </div>
        )
    }
    
    else if (!user && method == 'login') {//login
        return (
            <div className="flex h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="m-auto w-full max-w-md space-y-8">
                    <div>
                    <h1 className="mx-auto text-center font-DMSans font-bold text-4xl">tabi</h1>
                    <h2 className="font-DMSans mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={loginAction}>
                        <div className="-space-y-px rounded-md">
                            <div className = "font-DMSans">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-tabiBlue focus:outline-none focus:ring-tabiBlue sm:text-sm"
                                placeholder="Email address"
                            />
                            </div>
                            <div className = "font-DMSans">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-tabiBlue focus:outline-none focus:ring-tabiBlue sm:text-sm"
                                placeholder="Password"
                            />
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-sm">
                                    Forgot your password?
                            </div>
                        </div>

                        <div>
                            <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-tabiBlue py-2 px-4 text-sm font-DMSans font-medium text-white hover:bg-tabiBlueDark focus:outline-none focus:ring-2 focus:ring-tabiBlue focus:ring-offset-2"
                            >
                            Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return ( //Logged in user page
    <div className="isolate bg-white flex flex-col h-screen justify-between">
        <Navbar activePage={'profile'} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

        <div className="grid place-items-center">
            <Stack>
                <div className="justify-center px-auto mx-auto mb-5">
                    <p className='font-DMSans font-bold text-sm mb-5' style = {{color: '#268DC7'}}>Your Account</p>
                    <Avatar name = {(user as any).email} size = "xl" />
                </div>
                <div className="justify-center">
                    <span className='font-DMSans text-2xl'>{(user as any).email}</span>
                </div>
                {/* <button className="bg-tabiBlue hover:bg-tabiBlueDark text-white p-2 rounded-lg" onClick={logout}>Sign out</button> */}
            </Stack>
        </div>

        <JourneyCreateButton />

        <div className="justify-center px-auto mx-auto mb-5">
            <span className='font-DMSans font-regular text-sm mb-5' style = {{color: 'gray'}}>You haven&apos;t created any Journeys yet. </span>
            <button onClick={()=>{router.push('/creation')}}className='font-DMSans font-regular text-sm mb-5' style = {{color: '#268DC7'}}>Create one now</button>
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


export default Profile