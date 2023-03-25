import { Stack, Text } from '@chakra-ui/react'

import Navbar from '../components/navbar'

const Custom404 = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-[91.2vh] font-DMSans">
        <Stack>
          <Text className='font-bold text-xl'>Oops, we couldn&apos;t find that page!</Text>
        </Stack>
      </div>
    </>
  )
}

export default Custom404
