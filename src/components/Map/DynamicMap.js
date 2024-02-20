import { useEffect, useState } from 'react'; // Added useState
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSettings } from '@components/Providers/SettingsProvider';
import { useGeolocated } from "react-geolocated"; // Added useGeolocated

import styles from './Map.module.scss';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
  const { settings, setSettings } = useSettings();
  const { coords } = useGeolocated(); // Get user location from useGeolocated hook
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  const [mapCenter, setMapCenter] = useState([coords?.longitude, coords?.latitude]); // Updated to use user location from useGeolocated

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
    setMapCenter([coords?.latitude||51.0538286, coords?.longitude||3.7250121]); // Update mapCenter when user location changes
  }, [coords?.latitude, coords?.longitude]);

  if (coords?.longitude && coords?.latitude) {
    return (
      <MapContainer key={coords.latitude + coords.longitude} className={mapClassName} center={mapCenter} {...rest}> {/* Updated center prop */}
        {children(ReactLeaflet, Leaflet)}
      </MapContainer>
    );
  } else {
    return <p>Turn on location data</p>;
  }
};

export default Map;
