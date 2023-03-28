import { Avatar, Stack } from '@chakra-ui/react'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/router'
import { ListDivider } from '@mui/joy'
import { createClient } from '@supabase/supabase-js'

const logout = async (e: React.MouseEvent<HTMLElement>) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'error', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'error')
  e.preventDefault()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  }
}

const NavbarAvatar = ({ username }) => {
  const router = useRouter()

  return (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button><Avatar name={username} size="sm" /></Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-md">
            <Stack className="flex px-6">
                {username !== '' &&
                  <>
                    <Menu.Item>
                        <button className="font-medium text-sm font-DMSans w-max py-3" onClick={() => { router.push('/profile') }}>
                            Account
                        </button>
                    </Menu.Item>

                    <Menu.Item>
                        <ListDivider />
                    </Menu.Item>
                  </>
                }

                { username !== '' && username !== undefined &&
                  <Menu.Item>
                      <button onClick={logout}>
                          <p className="font-bold mx-auto text-sm text-red-500 font-DMSans w-max py-2">Sign Out</p>
                      </button>
                  </Menu.Item>
                }

                { (username === '' || username === undefined) &&
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

export default NavbarAvatar
