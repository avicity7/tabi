import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import { createClient } from '@supabase/supabase-js'

const Login = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const router = useRouter();
    const [currentUser,setUser] = useState({})
    const [email, setEmail] = useState(''); // email of the user
    const [password, setPassword] = useState(''); // password of the user

    const loginAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email, 
            password
        })
        if (!error) {
            router.replace('/')
        } 
        else { 
            console.log(error)
        }
    };
    
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

export default Login