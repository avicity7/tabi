import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useEffect, useState } from 'react';
import { Input } from "@chakra-ui/react";
import { List } from "antd";

const SearchInput = () => {
    const [place, savePlace] = useState('')

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    });
    console.log(placePredictions)

    return (
        <div className="font-DMSans">
            <Input
                placeholder="Enter Destination Name"
                onChange={(evt) => {
                getPlacePredictions({ input: evt.target.value });
                }}
            />
            
            {placePredictions.length != 0 && (<List
                dataSource={placePredictions}
                renderItem={(item) => (
                    <List.Item className="font-DMSans font-medium ml-2 mr-2">
                        <List.Item.Meta title={<button onClick={()=>{console.log(item)}}>{item.description}</button>} />
                    </List.Item>
                )}
            />)}
        </div>
    )
}

export default SearchInput