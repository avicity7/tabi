import { Avatar, Stack } from '@chakra-ui/react'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/router'
import { ListDivider } from '@mui/joy'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import getUsername from '../utils/getUsername'
import { getCookie, setCookie } from 'cookies-next'

const logout = async (e: React.MouseEvent<HTMLElement>) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')
  e.preventDefault()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  }
}

const NavbarAvatar = (props) => {
  const router = useRouter()
  const [username, setUsername] = useState(props.username !== undefined ? props.username : '')
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    const fetchData = async () => {
      const user = await supabaseClient.auth.getUser()
      let fetchedUsername = null
      if (user.data.user !== null) {
        fetchedUsername = await getUsername(user.data.user.id)
      }
      try {
        if (fetchedUsername !== username) {
          setUsername(fetchedUsername)
        }
        if (getCookie('username') === undefined) {
          setCookie('username', fetchedUsername)
        }
      } catch {

      }
    }
    fetchData()
  }, [])

  return (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button><Avatar name={username} size="sm" /></Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-md">
            <Stack className="flex px-6">
                {username !== '' && username !== null &&
                  <>
                    <Menu.Item>
                        <button className="font-medium text-sm font-DMSans w-max py-3" onClick={() => { router.push('/profile') }}>
                            Account
                        </button>
                    </Menu.Item>

                    <Menu.Item>
                        <ListDivider />
                    </Menu.Item>

                    <Menu.Item>
                        <button onClick={logout}>
                            <p className="font-bold mx-auto text-sm text-red-500 font-DMSans w-max py-2">Sign Out</p>
                        </button>
                    </Menu.Item>
                  </>
                }

                { (username === '' || username === null) &&
                  <Menu.Item>
                      <button onClick={() => { router.push('/login') }}>
                          <p className="font-bold mx-auto text-sm text-tabiBlue hover:text-tabiBlueDark font-DMSans w-max py-2">Sign In</p>
                      </button>
                  </Menu.Item>
                }

            </Stack>
        </Menu.Items>
    </Menu>
  )
}

export const getServerSideProps = ({ req, res }) => {
  const username = getCookie('username', { req, res }) !== undefined ? getCookie('username', { req, res }) : null

  return { props: { username } }
}

export default NavbarAvatar
