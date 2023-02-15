import { useRouter } from "next/router";
import { Card, CardBody, Stack, Image, Text, } from '@chakra-ui/react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Icon } from '@iconify-icon/react';
import { useDisclosure } from '@chakra-ui/react';

import Navbar from '../components/navbar';
import JourneyCreateButton from '../components/journeyCreateButton';

const Home = ({data}) => {
  const router = useRouter();
  const user = useUser();
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure()

  const pushToJourney = (journey_id) => {
    router.push({
      pathname: '/journey',
      query: {journey_id: journey_id}
    })
  }

  return (
    <div className="isolate bg-white">
      <Navbar activePage={'index'} user={user} router={router} onOpenDrawer={onOpenDrawer} onCloseDrawer={onCloseDrawer} isOpenDrawer={isOpenDrawer} onOpenSearch={onOpenSearch} isOpenSearch={isOpenSearch} onCloseSearch={onCloseSearch}/>

      <ul>
        {data.map((journey) => (
          <li key={journey.id}>
              <div className="grid place-items-center font-DMSans">
                <button onClick={() => {pushToJourney(journey.id)}}>
                  <Card maxW={'lg'} className = "my-5 mx-5" overflow="hidden">
                    <Image objectFit='fill' src='https://www.timetravelturtle.com/wp-content/uploads/2018/11/Tokyo-2018-280_feat1.jpg' alt='tokyo'/>
                    <CardBody>
                      <Stack spacing='3'>
                        <div className="flex flex-row justify-between">
                          <Text fontSize='2xl' className="font-bold text-left">{journey.journey_name}</Text>
                          <div className="flex flex-row items-center">
                            <ArrowUpwardRoundedIcon fontSize="medium" style={{ color: '#268DC7'}}/>
                            <Text fontSize='2xl' className="font-bold text-left pl-1">{journey.journey_upvotes}</Text>
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <Icon icon="charm:person" style={{color:'#CBCBCB'}} />
                          <Text fontSize='xs' className="font-medium text-left pl-0.5 pt-0.3" style={{color:'#CBCBCB'}}>{journey.author_username}</Text>
                        </div>
                        <Text fontSize='md' className="font-regular text-left" color="black">{journey.journey_summary}</Text>
                      </Stack>
                    </CardBody>
                    
                  </Card>
                </button>
              </div>
          </li>
        ))}
      </ul>

      <JourneyCreateButton router={router}/>

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