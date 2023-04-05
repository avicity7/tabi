import { useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { Spinner } from '@chakra-ui/react'

import getUsername from '../utils/getUsername'

const createJourney = async (user, router, journeyName) => {
  const username = await getUsername(user.id)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')

  const { data: journeyInsertData, error: journeyInsertError } = await supabase
    .from('journeys')
    .insert({ journey_name: journeyName, author_username: username, user_id: user.id })
    .select()

  if (journeyInsertError == null) {
    router.push({
      pathname: '/editJourney',
      query: { journeyId: journeyInsertData[0].id }
    })
  } else {
    console.log(journeyInsertError)
  }
}

const Creation = () => {
  const router = useRouter()
  const [journeyName, setJourneyName] = useState('')
  const [creating, setCreating] = useState(false)
  const user = useUser()

  return (
    <div className="flex h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="m-auto w-full max-w-md space-y-8">
            <div>
            <h1 className="mx-auto text-center font-DMSans font-bold text-4xl">tabi</h1>
            <h2 className="font-DMSans mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Name your Journey
            </h2>
            <h3 className="font-DMSans mt-6 text-center text-sm font-light tracking-tight text-gray-600">
                You can edit this at any time!
            </h3>
            </div>
            <div className="-space-y-px rounded-md">
                <div className = "font-DMSans">
                <input
                    onChange={(e) => { setJourneyName(e.target.value) }}
                    id="journeyName"
                    name="journeyName"
                    type="text"
                    autoComplete="text"
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-tabiBlue focus:outline-none focus:ring-tabiBlue sm:text-sm"
                />
                </div>
            </div>

            <div>
                {!creating &&
                  <button
                  onClick={async () => { setCreating(true); if (!creating) await createJourney(user, router, journeyName) }}
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-tabiBlue py-2 px-4 text-sm font-DMSans font-medium text-white hover:bg-tabiBlueDark focus:outline-none focus:ring-2 focus:ring-tabiBlue focus:ring-offset-2"
                  >
                  Create Journey
                  </button>
                }
                {creating &&
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='#268DC7' size='xl'/>
                }
            </div>

        </div>
    </div>
  )
}

export default Creation
