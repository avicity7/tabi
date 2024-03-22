import { Stack, Text, Card, CardBody, Image } from '@chakra-ui/react'

const DestinationCard = ({ destination, index, onClick }) => {
  return (
    <Card className="my-2" minW={{ base: '2xs', lg: 'lg' }} maxW={{ base: '2xs', lg: 'lg' }}>
      <CardBody>
          <div className="flex flex-row items-center px-1">
              <Text className="text-tabiBlue text-md text-center font-bold mr-5">{parseInt(index) + 1}</Text>

              <Stack>
                  <div className="flex items-center">
                    <Text className="text-md font-medium text-left mr-2">{destination.name}</Text>
                    <Image src={destination.icon} alt="icon" boxSize='12px'></Image>
                  </div>
                  { destination.editorial_summary !== undefined &&
                    <Text className="text-sm font-regular text-left">{destination.editorial_summary.overview}</Text>
                  }
                  { destination.notes !== undefined &&
                    <Stack>
                      <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Notes</Text>
                      <Text className="text-sm font-regular text-left">{destination.notes}</Text>
                    </Stack>
                  }
                  { destination.budget !== undefined &&
                    <Stack>
                      <Text className="text-sm font-medium text-left text-tabiBlue mt-4">Budget</Text>
                      <Text className="text-md font-medium text-left">${destination.budget}</Text>
                    </Stack>
                  }
                  <div className='pt-2 max-w-fit'>
                    <button
                      onClick={onClick}
                      className='text-white text-xs p-2 bg-tabiBlue hover:bg-tabiBlueDark rounded'
                    >
                      Open Details
                    </button>
                  </div>
              </Stack>
          </div>
      </CardBody>
  </Card>
  )
}

export default DestinationCard
