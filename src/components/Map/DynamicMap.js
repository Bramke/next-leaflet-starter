import { useEffect, useState } from 'react'; // Added useState
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSettings } from '@components/Providers/SettingsProvider';

import styles from './Map.module.scss';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
  const { settings, setSettings } = useSettings();
  //settings.userLocation.long, settings.userLocation.lat
  let mapClassName = styles.map;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  const [mapCenter, setMapCenter] = useState([settings.userLocation.long, settings.userLocation.lat]); // Added mapCenter state

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
    setMapCenter([settings.userLocation.lat, settings.userLocation.long]); // Update mapCenter when user location changes
  }, [settings.userLocation.lat, settings.userLocation.long]);

  return (
    <MapContainer className={mapClassName} center={mapCenter} {...rest}> {/* Updated center prop */}
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  );
};

export default Map;
