import { Avatar, Stack } from "@chakra-ui/react";
import { Menu } from '@headlessui/react';
import { useRouter } from "next/router";
import { ListDivider } from "@mui/joy";

const NavbarAvatar = ({username}) => {
    const router = useRouter();

    return(
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button><Avatar name = {username} size = "sm" /></Menu.Button>
            
            <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-md bg-white shadow-md">
                <Stack className="flex px-6">
                    <Menu.Item>
                        <button className="font-medium text-sm font-DMSans w-max py-3" onClick={()=>{router.push('/profile')}}>
                            Account
                        </button>
                    </Menu.Item>

                    <Menu.Item>
                        <ListDivider />
                    </Menu.Item>

                    <Menu.Item>
                        <button onClick={()=>{router.push('/profile')}}>
                            <p className="font-bold text-sm text-red-500 font-DMSans w-max py-2">Sign Out</p>
                        </button>
                    </Menu.Item>
                </Stack>
            </Menu.Items>
        </Menu>
    )
}

export default NavbarAvatar