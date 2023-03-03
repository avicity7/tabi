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

const Map = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{height: "91.2vh", width: "100%"}} touchZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[51.505, -0.09]} icon={getIcon(40)} eventHandlers={{
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

export default Map