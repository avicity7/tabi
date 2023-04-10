import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { Text, Input, Stack } from '@chakra-ui/react'
import getPlaceIDDetails from '../utils/getPlaceIDDetails'

const retrievePlaceLatLng = async (placeID) => {
  const response = await fetch('api/searchPlaceID', {
    method: 'POST',
    body: JSON.stringify(placeID)
  })

  const data = await response.json()

  return data.result
}

const SearchInput = ({ viewState, setViewState, setSearchInputData }) => {
  const {
    placePredictions,
    getPlacePredictions
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  })

  return (
        <div className="font-DMSans">
            <Input
                placeholder="Add Destination"
                onChange={(evt) => {
                  getPlacePredictions({ input: evt.target.value })
                }}
            />

            {placePredictions.length !== 0 &&
            <ul className="mx-4">
              {placePredictions.map((item) => (
                <li key={item.place_id} className="my-4 pb-2 flex justify-center border-b-2 rounded-b-xs">
                  <button onClick={async () => {
                    const data = await retrievePlaceLatLng(item.place_id)
                    setViewState({
                      latitude: data.geometry.location.lat,
                      longitude: data.geometry.location.lng,
                      zoom: 15
                    })
                    const placeData = await getPlaceIDDetails(data.place_id)
                    setSearchInputData(placeData)
                  }}>
                    <Stack>
                     <Text className="font-DMSans font-bold">{item.structured_formatting.main_text}</Text>
                     <Text className="font-DMSans font-regular text-gray-700">{item.structured_formatting.secondary_text}</Text>
                    </Stack>
                  </button>
                </li>
              ))}
            </ul>
            }

        </div>
  )
}

export default SearchInput
