import Head from 'next/head';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import axios from 'axios';

import styles from '@styles/Home.module.scss';
import { useEffect, useState, useRef } from 'react';
import DottOrBoltMarkers from '@components/Marker/DottOrBoltMarkers';
import BlueBikeMarkers from '@components/Marker/BlueBikeMarkers';
import DonkeyMarkers from '@components/Marker/DonkeyMarkers';
import DeLijnMarkers from '@components/Marker/DeLijnMarkers';
import { useSettings } from '@components/Providers/SettingsProvider';
const Map = dynamic(() => import('@components/Map'), { ssr: false }); // Dynamically import Map component

const DEFAULT_CENTER = [51.05, 3.71667];
const DOTT_DATASET_NAME = 'dott-deelfietsen-gent';
const BOLT_DATASET_NAME = 'bolt-deelfietsen-gent';
const COOKIE_RESET_TIME = 120000

export default function Dott() {

  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const getUserLocation = () => {
    const storageLocation = localStorage.getItem('userLocation');
    const storageTimestamp = localStorage.getItem('userLocationTimestamp');
    const currentTime = new Date().getTime();
    if (storageLocation && storageTimestamp && currentTime - storageTimestamp < COOKIE_RESET_TIME) {
      setUserLocation(JSON.parse(storageLocation));
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
          localStorage.setItem('userLocationTimestamp', currentTime.toString());
        });
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    }
  };
  useEffect(() => {
    getUserLocation();
  }, []);

  const { settings } = useSettings();
  return (
    <Layout>
      <Head>
        <title>Ghent Rental Bike</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
      {userLocation === null && <Button onClick={getUserLocation}>Locate Me</Button>}
        <Container>
            <Map className={styles.homeMap} center={userLocation} zoom={16}>
              {({ TileLayer, Marker, Popup }) => (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  />
                    {settings.microMobilityMode && (
                      <>
                        <DottOrBoltMarkers DatasetName={DOTT_DATASET_NAME} Marker={Marker} Popup={Popup} />
                        <DottOrBoltMarkers DatasetName={BOLT_DATASET_NAME} Marker={Marker} Popup={Popup} />
                        <BlueBikeMarkers Marker={Marker} Popup={Popup} />
                        <DonkeyMarkers Marker={Marker} Popup={Popup} />
                      </>
                    )}
                    {settings.publicTransit && (
                      <>
                      <DeLijnMarkers Marker={Marker} Popup={Popup} />
                      </>
                    )}
                </>
              )}
            </Map>
        </Container>
      </Section>
    </Layout>
  );
}

