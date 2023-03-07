import { MapContainer, Marker, Popup, TileLayer, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../public/img/Marker.png';
import { Stack, Text } from '@chakra-ui/react';

const getIcon = (iconSize) => {
  return L.icon({
    iconUrl: marker.src,
    iconRetinaUrl: marker.src,
    iconSize: new L.Point(iconSize, iconSize+2),
  })
}

const MapView = () => {
  return (
    <MapContainer center={[35.6812, 139.7671]} zoom={13} style={{height: "91vh", width: "100%"}} touchZoom={true} attributionControl={false}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/avicity7/clewhy0yo000901rzkk9xx3bt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXZpY2l0eTciLCJhIjoiY2xld2h1eWMzMDNrODN5bjB0ZTE3MGZzZCJ9.RLzBR-HXByf0f69benFZyQ"
      />

      <Marker position={[35.6812, 139.7671]} icon={getIcon(40)} eventHandlers={{
        click: (e) => {
          console.log('marker clicked', e)
        },
      }}>
        <Popup>
          <Stack>
            <Text className="font-DMSans font-medium text-lg py-0">The Borough</Text>
            <Text className="font-DMSans text-sm pb-5">A bar with a lively atmosphere.</Text>
          </Stack>
        </Popup>
      </Marker>

    </MapContainer>
  )
}

export default MapView