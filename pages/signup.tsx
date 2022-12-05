import { useState } from 'react'
import { useRouter } from "next/router";
import Link from 'next/link'
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from './api/firebase-config'


const SignUp = () => {
  const router = useRouter();
  const [currentUser,setUser] = useState({})
  const register = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const registerEmail = (document.querySelector("#email-address") as HTMLInputElement).value;
      const registerPassword = (document.querySelector("#password") as HTMLInputElement).value;
      try { 
          const user = await createUserWithEmailAndPassword(auth,registerEmail,registerPassword);
          router.push('/')
      }
      catch {
          console.log("Error")
      }
  };
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

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
                <Link href="/login" className="font-DMSans font-medium text-tabiBlue hover:text-tabiBlueDark">
                  Already have an account?
                </Link>
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

export default SignUp