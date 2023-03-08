import { useState } from "react";
import { Avatar } from "@chakra-ui/react";
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import { useRouter } from "next/router";

const NavbarAvatar = ({username}) => {
    const router = useRouter();

    const [accountOpen, setAccountOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const handleAccountClose = () => setAccountOpen(false);

    return(
        <div>
            <button onClick={(e)=>{setAnchorEl(e.currentTarget);setAccountOpen(true);}}>
            <span>{<Avatar name = {username} size = "sm" />}</span>
            </button>
            <Menu
            anchorEl={anchorEl}
            keepMounted={true}
            open={accountOpen}
            onClose={()=>{handleAccountClose();setAnchorEl(null)}}
            placement="bottom-end"
            >
            <MenuItem className="font-medium text-sm px-5 font-DMSans" onClick={()=>{router.push('/profile')}}>
                Account
            </MenuItem>
            <ListDivider />
            <MenuItem className="font-semibold text-sm px-5 text-red-400 font-DMSans" onClick={handleAccountClose}>
                Sign Out
            </MenuItem>
            </Menu>
        </div>
    )
}

export default NavbarAvatar