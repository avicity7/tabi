import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Image } from '@chakra-ui/react'
import Head from 'next/head'

const Login = () => {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (!error) {
      router.push('/')
    }
  }

  return (
    <div className="flex h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Login | tabi</title>
        </Head>
        <div className="m-auto w-full max-w-md space-y-8">
            <div>
              <div className='flex justify-center'>
                <Image src="/img/tabi.png" maxW='12'/>
              </div>
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
                        onChange={(e) => { setEmail(e.target.value) }}
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
                        onChange={(e) => { setPassword(e.target.value) }}
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

                <div className="flex items-center justify-center">
                    <div className="text-sm">
                    <button onClick={(e) => { e.preventDefault(); router.push('/signup') }}className="font-DMSans font-medium text-tabiBlue hover:text-tabiBlueDark">
                        Don&apos;t have an account yet?
                    </button>
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
