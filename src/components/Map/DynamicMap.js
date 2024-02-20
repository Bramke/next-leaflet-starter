import { useEffect, useState } from 'react'; // Added useState
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSettings } from '@components/Providers/SettingsProvider';
import { useGeolocated } from "react-geolocated"; // Added useGeolocated
import { Marker, Popup } from 'react-leaflet';

import styles from './Map.module.scss';
import { Entity, EntityField, Text } from 'nextjs-components';
import Image from 'next/image';

const { MapContainer, useMap } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
  const { settings, setSettings } = useSettings();
  const { coords } = useGeolocated(); // Get user location from useGeolocated hook
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  const [mapCenter, setMapCenter] = useState([51.0538286, 3.7250121]); // Default center

  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
        iconUrl: 'leaflet/images/marker-icon.png',
        shadowUrl: 'leaflet/images/marker-shadow.png',
      });
    })();
  }, []);

  useEffect(() => {
    if (coords) {
      setMapCenter([coords.latitude, coords.longitude]); // Update mapCenter when user location changes
    }
  }, [coords]);

  const UserLocationMarker = () => {
    const map = useMap();
    // Set the map view to user location
    useEffect(() => {
      if (coords) {
        map.setView([coords.latitude, coords.longitude], map.getZoom());
      }
    }, [coords]);
    //Return the visible marker
    return (
      <Marker color="blue" position={[coords.latitude, coords.longitude]} 
      icon={L.icon({
        iconUrl: `/leaflet/images/userlocation.svg`,
        iconSize: [40, 40]
      })}
      >
        <Popup>
          <Text size={16} weight="800">Your location</Text>
          <Entity>
            <EntityField title="Lat" description={coords.latitude} />
            <EntityField title="Lon" description={coords.longitude} />
          </Entity>
        </Popup>
      </Marker>
     )
  };

  if (coords?.longitude && coords?.latitude) {
    return (
      <MapContainer key={coords.latitude + coords.longitude} className={mapClassName} center={mapCenter} {...rest}>
        <UserLocationMarker />
        {children(ReactLeaflet, Leaflet)}
      </MapContainer>
    );
  } else {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white'
      }}>
        <Text size={32} weight="900">Turn on location data</Text>
        <Text size={25} weight="600">To start using the Ghent mobility map</Text>
        <Image src="/images/allow_location.png" width={200} height={200} style={{paddingTop: "2vh"}}/>
      </div>
    )
  }
};

export default Map;
