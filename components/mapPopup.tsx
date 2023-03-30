import { Stack, Text, Textarea, Image, NumberInput, NumberInputField } from '@chakra-ui/react'
import { Icon } from '@iconify-icon/react'
import { useState } from 'react'

const MapPopup = ({ userId, router, searchInputData, resetMapPopup, userDestinationData, setUserDestinationData, updateDestinations, refresh, setRefresh, currentDay }) => {
  const [notes, setNotes] = useState('')
  const [budget, setBudget] = useState('')
  const [addingNotes, setAddingNotes] = useState(false)
  const [addingBudget, setAddingBudget] = useState(false)

  return (
    <>
    { Object.keys(searchInputData).length !== 6 &&
      <Stack className="absolute inset-x-10 bottom-5 right-10 rounded-md bg-white shadow-md py-5 px-5 shadow-xl">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Text className="font-medium text-left mr-2">{searchInputData.name}</Text>
            { searchInputData.icon !== undefined &&
              <Image src={searchInputData.icon} alt="icon" boxSize='12px'></Image>
            }
          </div>
          <button onClick={resetMapPopup}>
            <Icon icon="ic:round-close"/>
          </button>
        </div>
        { searchInputData.editorial_summary !== undefined &&
          <Text className="text-sm font-regular text-left">{searchInputData.editorial_summary.overview}</Text>
        }
        { searchInputData.notes !== undefined && !addingNotes &&
          <Stack className="pb-2">
            <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Notes</Text>
            <Text className="text-sm font-regular text-left">{searchInputData.notes}</Text>
          </Stack>
        }
        {addingNotes &&
          <Stack>
              <button className="flex flex-row items-center" onClick={ () => {
                setAddingNotes(false)
              }}>
                <Icon icon="ic:round-close" className='text-[#CBCBCB] hover:text-gray-400'/>
              </button>
              <Textarea value={notes} placeholder="Enter notes" className="text-sm" onChange={ (e) => { setNotes(e.target.value) }}/>
              <button className='flex justify-start w-fit' onClick={ () => {
                setAddingNotes(false)
                const index = userDestinationData[currentDay].destinations.indexOf(searchInputData)
                if (notes !== '') {
                  userDestinationData[currentDay].destinations[index].notes = notes
                } else {
                  userDestinationData[currentDay].destinations[index].notes = undefined
                }
                updateDestinations(userDestinationData, router.query.journeyId, userId)
                setRefresh(!refresh)
              }}>
                <Text className="text-sm text-tabiBlue hover:text-tabiBlueDark">Save</Text>
              </button>
          </Stack>
        }
        { searchInputData.budget !== undefined && !addingBudget &&
          <Stack className="pb-2">
            <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Budget</Text>
            <Text className="text-md font-medium text-left">${searchInputData.budget}</Text>
          </Stack>
        }
        {addingBudget &&
          <Stack>
              <button className="flex flex-row items-center" onClick={ () => {
                setAddingBudget(false)
              }}>
                <Icon icon="ic:round-close" className='text-[#CBCBCB] hover:text-gray-400'/>
              </button>
              <NumberInput value={budget}>
                <NumberInputField className="text-sm" onChange={ (e) => { setBudget(e.target.value) }}>
                </NumberInputField>
              </NumberInput>
              <button className='flex justify-start w-fit' onClick={ () => {
                setAddingBudget(false)
                const index = userDestinationData[currentDay].destinations.indexOf(searchInputData)
                if (budget !== null) {
                  userDestinationData[currentDay].destinations[index].budget = budget
                } else {
                  userDestinationData[currentDay].destinations[index].budget = undefined
                }
                updateDestinations(userDestinationData, router.query.journeyId, userId)
                setRefresh(!refresh)
              }}>
                <Text className="text-sm text-tabiBlue hover:text-tabiBlueDark">Save</Text>
              </button>
          </Stack>
        }
        <div className="flex flex-row items-center min-w-full pt-2">
          {userDestinationData !== null && userDestinationData[currentDay].destinations.includes(searchInputData) &&
            <>
              <button onClick={ () => { setNotes(searchInputData.notes); setAddingNotes(true) }}>
                  {searchInputData.notes === undefined &&
                      <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-3">
                      <Icon icon="mi:add" />
                      <Text className="ml-1 text-sm font-medium text-left">Add Notes</Text>
                    </div>
                  }
                  {searchInputData.notes !== undefined &&
                    <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-3">
                      <Icon icon="iconoir:edit-pencil" />
                      <Text className="ml-1 text-sm font-medium text-left">Edit Notes</Text>
                    </div>
                  }
              </button>
              <button onClick={ () => { setBudget(searchInputData.budget); setAddingBudget(true) }}>
                  {searchInputData.budget === undefined &&
                      <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-4">
                      <Icon icon="material-symbols:attach-money-rounded" />
                      <Text className="text-sm font-medium text-left">Add Budget</Text>
                    </div>
                  }
                  {searchInputData.budget !== undefined &&
                    <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark mr-4">
                      <Icon icon="material-symbols:attach-money-rounded" />
                      <Text className="text-sm font-medium text-left">Edit Budget</Text>
                    </div>
                  }
              </button>
            </>
          }
          { searchInputData.website !== undefined &&
            <a href={searchInputData.website} rel="noopener noreferrer" target="_blank">
              <div className="flex items-center text-tabiBlue hover:text-tabiBlueDark">
                <Icon icon="material-symbols:web-asset" />
                <Text className="ml-1 text-sm font-medium text-left">Website</Text>
              </div>
            </a>
          }
          {userDestinationData !== null &&
            <div className="flex grow justify-end">
              { userDestinationData[currentDay].destinations.includes(searchInputData) === false &&
              <button onClick={() => {
                const temp = userDestinationData
                temp[currentDay].destinations.push(searchInputData)
                setUserDestinationData(temp)
                updateDestinations(temp, router.query.journeyId, userId)
                setRefresh(!refresh)
              }}>
                <Text className="text-sm text-white font-regular text-left bg-tabiBlue hover:bg-tabiBlueDark px-4 py-1 rounded-full">Add Destination</Text>
              </button>
              }

              { userDestinationData[currentDay].destinations.includes(searchInputData) === true &&
              <button onClick={() => {
                userDestinationData[currentDay].destinations.splice(userDestinationData[currentDay].destinations.indexOf(searchInputData), 1)
                updateDestinations(userDestinationData, router.query.journeyId, userId)
                setRefresh(!refresh)
              }}>
                <Text className="text-sm text-white font-regular text-left bg-red-600 hover:bg-red-700 px-4 py-1 rounded-full">Remove Destination</Text>
              </button>
              }
            </div>
          }
        </div>
      </Stack>
    }
    </>
  )
}

export default MapPopup
