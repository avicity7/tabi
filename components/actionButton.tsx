import { DotsThreeOutline, Share } from 'phosphor-react'
import { Menu } from '@headlessui/react'
import { Stack } from '@chakra-ui/react'

const ActionButton = ({ onClick }) => {
  return (
    <Menu>
      <Menu.Button className="w-8 h-8 rounded-full bg-white shadow-md my-5 ml-2 text-black hover:text-[#268DC7] transition-none">
        <DotsThreeOutline size="18" className = "mx-auto"/>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-16 origin-top-right rounded-md bg-white shadow-md">
        <Stack>
          <Menu.Item>
            <button className="font-medium text-sm font-DMSans w-max py-3 px-3 flex flex-row items-center" onClick={() => {}}>
              <Share size="16" className="mr-1"/>Share
            </button>
          </Menu.Item>
        </Stack>
      </Menu.Items>
    </Menu>
  )
}

export default ActionButton
