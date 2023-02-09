import { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/router";
import { Avatar, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, AlertDialogCloseButton,Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass,ArrowLeft } from "phosphor-react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const Profile = () => {
    const supabase = useSupabaseClient()
    const router = useRouter();
    const [currentUser,setUser] = useState()
    const user = useUser();

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const [method, setMethod] = useState('signup')


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
    if (!user && method == 'signup'){
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

    return (
    <div className="isolate bg-white">
        <header className="sticky top-0 z-10 px-2 py-4 bg-white">
                <div className="flex h-[5vh] items-center justify-between px-5" aria-label="Global">
                    <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="font-DMSans font-bold text-3xl">tabi</span>
                        <span className="font-DMSans text-xs ml-1">alpha</span>
                    </Link>
                    </div>
                    <button className='flex min-w-0 flex-1 justify-end px-5'>
                    <MagnifyingGlass size = "26"></MagnifyingGlass>
                    </button>
                    <div>
                        <span>{user != null? <Avatar name = {(user as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                    </div>
                </div>
            </header>

        <div className="grid place-items-center">
            <Stack>
                <button className="w-8 h-8 rounded-full bg-white shadow-md mx-5 my-5" onClick={() => {router.push('/')}}>
                    <ArrowLeft color="black" size="18" className = "mx-auto"/>
                </button>
                <div className="justify-center px-auto">
                    <Avatar name = {user != null? (user as any).email: ""} size = "xl" />
                </div>
                <div className="min-w-0 flex-1 justify-center">
                    <span className='font-DMSans text-2xl'>{user != null? (user as any).email : <span>Not logged in</span>}</span>
                </div>
                    <Button backgroundColor="#268DC7" color="white" onClick={logout}>Sign out</Button>
            </Stack>
        </div>
    </div>
    )
}


export default Profile