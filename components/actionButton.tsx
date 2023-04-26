import { DotsThreeOutline, Share } from 'phosphor-react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import { Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { Icon } from '@iconify-icon/react'

const ActionButton = ({ onClick }) => {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <Menu>
        <Menu.Button className="w-8 h-8 rounded-full bg-white shadow-md my-5 ml-2 text-black hover:text-[#268DC7] transition-none">
          <DotsThreeOutline size="18" className = "mx-auto"/>
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-16 origin-top-right rounded-md bg-white shadow-md">
          <Stack>
            <Menu.Item>
              <button className="font-medium text-sm font-DMSans w-max py-3 px-3 flex flex-row items-center" onClick={() => { setShareOpen(true) }}>
                <Share size="16" className="mr-1"/>Share
              </button>
            </Menu.Item>
          </Stack>
        </Menu.Items>
      </Menu>
      <Transition appear show={shareOpen}>
        <Dialog className="relative z-10" onClose={() => { setShareOpen(false) }}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-row items-center justify-center text-center text-lg font-DMSans font-medium leading-6 text-gray-900"
                  >
                    <span className="text-green-600 flex justify-center mr-3">
                      <Icon icon="charm:tick"/>
                    </span>
                    Share link copied to clipboard!
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ActionButton
