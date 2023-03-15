import { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/router";
import { PencilSimple } from "phosphor-react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Icon } from '@iconify-icon/react';
import { 
    Text,
    Avatar,
    useDisclosure, 
    Stack,
    Spinner,
    Card,
    CardBody,
    Image
} from '@chakra-ui/react';

import Navbar from '../components/navbar';
import JourneyCreateButton from '../components/journeyCreateButton';
import getUsername from '../utils/getUsername';
import Footer from '../components/footer';

const Profile = (props) => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const username = props.username;

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const [method, setMethod] = useState('signup');

    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();

    const [ publicJourneys, setPublicJourneys ] = useState([]);
    const [ privateJourneys, setPrivateJourneys ] = useState([]);
    const [ loaded, setLoaded ] = useState(false);

    const logout = async (e: React.MouseEvent<HTMLElement>) => {    
        e.preventDefault();
        const { error } = await supabase.auth.signOut();
        router.push('/')
    };

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

    useEffect(()=>{
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        const fetchData = async() => {
            const {data: publicJourneys, error: publicJourneyError}= await supabase
            .from('publicJourneys')
            .select()
            .eq('author_username',username)

            const {data: privateJourneys, error: privateJourneyError}= await supabase
            .from('privateJourneys')
            .select()
            .eq('author_username',username)

            setPublicJourneys(publicJourneys);
            setPrivateJourneys(privateJourneys);
            setLoaded(!loaded)
        }
        
        if (loaded == false){
            fetchData()
        }
    },[username,loaded])

    if (!username && method == 'signup'){//signup
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
    
    else if (!username && method == 'login') {//login
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

    if (loaded == false) {
        return (
            <div className="isolate bg-white flex flex-col h-screen justify-between">
                <Navbar activePage={'profile'} username={username}/>

                <div className="grid place-items-center">
                    <Stack>
                        <div className="justify-center px-auto mx-auto mb-5">
                            <p className='font-DMSans font-bold text-sm mb-5' style = {{color: '#268DC7'}}>Your Account</p>
                            <Avatar name = {username} size = "xl" />
                        </div>
                        <div className="flex justify-center">
                            <span className='font-DMSans text-2xl'>{username}</span>
                        </div>
                    </Stack>
                </div>

                <JourneyCreateButton />

                <div className="flex justify-center items-center h-[91.2vh]">
                    <Stack>
                        <div className="flex justify-center">
                            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                        </div>
                        <p className="font-DMSans font-medium">Loading...</p>
                    </Stack>
                </div>


                <Footer />
            </div>
        )
    }

    else {
        return ( //Logged in user page
            <div className="isolate bg-white flex flex-col h-screen justify-between">
                <Navbar activePage={'profile'} username={username}/>

                <div className="grid place-items-center mb-5">
                    <Stack>
                        <div className="justify-center px-auto mx-auto mb-5">
                            <p className='font-DMSans font-bold text-sm mb-5' style = {{color: '#268DC7'}}>Your Account</p>
                            <Avatar name = {username} size = "xl" />
                        </div>
                        <div className="flex justify-center">
                            <span className='font-DMSans text-2xl'>{username}</span>
                        </div>
                    </Stack>
                </div>

                <JourneyCreateButton />

                { privateJourneys.length != 0 &&
                    <div className="font-DMSans px-10 my-3">
                        <Text className="font-medium text-lg">Your Private Journeys</Text>
                        <ul>
                            { privateJourneys.map((privateJourney) => (
                                <li key={privateJourney.id}>
                                    <button onClick={() => {
                                        router.push({
                                            pathname: '/journey',
                                            query: {journey_id: privateJourney.id}
                                        })
                                    }}>
                                        <Card borderRadius="lg" minW='xs' maxW='xs' className = "my-5 shadow-md" overflow="hidden">
                                        <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                                        <CardBody>
                                            <Stack spacing='3'>
                                            <div className="flex flex-row justify-between">
                                                <Text fontSize='2xl' className="font-bold text-left">{privateJourney.journey_name}</Text>
                                                <div className="flex flex-row items-center">
                                                <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7'}}/>
                                                <Text fontSize='xl' className="font-bold text-left pl-1">{privateJourney.journey_upvotes}</Text>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center">
                                                <Icon icon="charm:person" style={{color:'#CBCBCB'}} />
                                                <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{color:'#CBCBCB'}}>{privateJourney.author_username}</Text>
                                            </div>
                                            <Text fontSize='md' className="font-regular text-left" color="black">{privateJourney.journey_summary}</Text>
                                            </Stack>
                                        </CardBody>
                                        
                                        </Card>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                { publicJourneys.length != 0 &&
                    <div className="font-DMSans px-10 my-3">
                        <Text className="font-medium text-lg">Your Public Journeys</Text>
                        <ul>
                            { publicJourneys.map((publicJourneys) => (
                                <li key={publicJourneys.id}>
                                    <button onClick={() => {
                                        router.push({
                                            pathname: '/journey',
                                            query: {journey_id: publicJourneys.id}
                                        })
                                    }}>
                                        <Card borderRadius="lg" minW='xs' maxW='xs' className = "my-5 shadow-md" overflow="hidden">
                                        <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                                        <CardBody>
                                            <Stack spacing='3'>
                                            <div className="flex flex-row justify-between">
                                                <Text fontSize='2xl' className="font-bold text-left">{publicJourneys.journey_name}</Text>
                                                <div className="flex flex-row items-center">
                                                <FavoriteBorderIcon fontSize="small" style={{ color: '#268DC7'}}/>
                                                <Text fontSize='xl' className="font-bold text-left pl-1">{publicJourneys.journey_upvotes}</Text>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center">
                                                <Icon icon="charm:person" style={{color:'#CBCBCB'}} />
                                                <Text fontSize='sm' className="font-normal text-left pl-0.5 pt-0.3" style={{color:'#CBCBCB'}}>{publicJourneys.author_username}</Text>
                                            </div>
                                            <Text fontSize='md' className="font-regular text-left" color="black">{publicJourneys.journey_summary}</Text>
                                            </Stack>
                                        </CardBody>
                                        
                                        </Card>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                
                { privateJourneys.length == 0 && publicJourneys.length == 0 &&
                    <div className="justify-center px-auto mx-auto mb-5">
                        <span className='font-DMSans font-regular text-sm mb-5' style = {{color: 'gray'}}>You haven&apos;t created any Journeys yet. </span>
                        <button onClick={()=>{router.push('/creation')}}className='font-DMSans font-regular text-sm mb-5' style = {{color: '#268DC7'}}>Create one now</button>
                    </div>
                }


                <Footer />
            </div>
        )
    }
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  let fetchedUsername = '';
  let user = "";

  const { data: { session } } = await supabase.auth.getSession();

  const fetchUsername = async() => {
      try {
        fetchedUsername = await getUsername(session.user.id)
        return fetchedUsername
      }
      catch {
        return fetchedUsername
      }
  } 

  const username = await fetchUsername();

  try { 
    user = session.user.id
  }
  catch {
    
  }

  return {
      props: {
      username: username,
      user: user
      },
  }
}

export default Profile