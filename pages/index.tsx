import { useState } from 'react'
import { useRouter } from "next/router";
import { Avatar, Box, Card, CardHeader, CardBody, CardFooter, Stack, Image, Heading, Text, Button, Divider, ButtonGroup, Skeleton,SkeletonText } from '@chakra-ui/react'
import Link from 'next/link'
import { PencilSimple, MagnifyingGlass } from "phosphor-react";
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const Home = ({data}) => {
  console.log(data);
  const router = useRouter();
  const supabase = useSupabaseClient()
  const user = useUser();

  const pushToUserPage = (e: React.MouseEvent<HTMLElement>) => {
      router.push('/profile')
  }

  const pushToJourney = (journey_id) => {
    router.push({
      pathname: '/journey',
      query: {journey_id: journey_id}
    })
  }

  return (
    <div className="isolate bg-white">
      <header className="sticky top-0 z-10 px-2 py-4 bg-white">
          <div className="flex h-[5vh] items-center justify-between px-5" aria-label="Global">
            <div className="flex lg:min-w-0 lg:flex-1 align-middle" aria-label="Global">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="font-DMSans font-bold text-4xl">tabi</span>
                <span className="font-DMSans text-xs ml-1">alpha</span>
              </Link>
            </div>
            <button className='flex min-w-0 flex-1 justify-end px-5'>
              <MagnifyingGlass size = "26"></MagnifyingGlass>
            </button>
            <div>
                <button onClick={pushToUserPage}>
                  <span>{user != null? <Avatar name = {(user as any).email} size = "sm" /> : <Avatar size = "sm"/>}</span>
                </button>
            </div>
          </div>
      </header>
      <ul>
        {data.map((journey) => (
          <li key="{journey}">
              <div className="grid place-items-center h-[80vh] font-DMSans">
                <button onClick={() => {pushToJourney(journey.id)}}>
                  <Card maxW={{base: 'sm',md: 'xl'}} className = "my-5 mx-5" overflow="hidden">
                    <Image objectFit='cover' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                    <CardBody>
                      <Stack spacing='5'>
                        <Text fontSize='2xl' className="font-bold text-left">{journey.journey_name}</Text>
                        <Text fontSize='lg' className="font-regular text-left" color="grey">{journey.journey_summary}</Text>
                      </Stack>
                    </CardBody>
                    
                  </Card>
                </button>
              </div>
          </li>
        ))}
      </ul>
      <div className = "fixed bottom-0 w-screen flex justify-end px-10 py-10">
        <button className="w-12 h-12 rounded-full bg-white hover:bg-white shadow-md">
              <PencilSimple color="#268DC7" size="26" className = "mx-auto"/>
        </button>
      </div>

    </div>
  )
}

export async function getServerSideProps(ctx) {
  const supabase = createServerSupabaseClient(ctx)
  let { data } = await supabase.from('journeys').select()

  return {
    props: {
     data: data
    },
  }
}


export default Home