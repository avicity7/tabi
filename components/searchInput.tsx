import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { Input } from '@chakra-ui/react'
import { List } from 'antd'

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

            {placePredictions.length !== 0 && (<List
                dataSource={placePredictions}
                renderItem={(item) => (
                    <List.Item className="font-DMSans font-medium ml-4 mr-4">
                        <List.Item.Meta title={<button onClick={async () => {
                          const data = await retrievePlaceLatLng(item.place_id)
                          setViewState({
                            latitude: data.geometry.location.lat,
                            longitude: data.geometry.location.lng,
                            zoom: viewState.zoom
                          })
                          setSearchInputData(data)
                        }}><span className="font-bold">{item.structured_formatting.main_text}</span>, {item.structured_formatting.secondary_text}</button>} />
                    </List.Item>
                )}
            />)}
        </div>
  )
}

export default SearchInput
