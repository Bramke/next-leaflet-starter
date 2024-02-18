import Head from 'next/head';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import { useMemo } from 'react'; // Import useMemo from react

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import axios from 'axios';
import useSWR from 'swr'
import styles from '@styles/Home.module.scss';
import { useEffect, useState, useRef } from 'react';
import DottOrBoltMarkers from '@components/Marker/MicroMobility/DottOrBoltMarkers';
import BlueBikeMarkers from '@components/Marker/MicroMobility/BlueBikeMarkers';
import DonkeyMarkers from '@components/Marker/MicroMobility/DonkeyMarkers';
import DeLijnMarkers from '@components/Marker/PublicTransit/DeLijnMarkers';
import { useSettings } from '@components/Providers/SettingsProvider';
import AutoCarsMarkers from '@components/Marker/PublicTransit/AutoCarsMarkers';
import NmbsMarkers from '@components/Marker/PublicTransit/NmbsMarkers';
const Map = dynamic(() => import('@components/Map'), { ssr: false }); // Dynamically import Map component

const DEFAULT_CENTER = [51.05, 3.71667];
const DOTT_DATASET_NAME = 'dott-deelfietsen-gent';
const BOLT_DATASET_NAME = 'bolt-deelfietsen-gent';
const COOKIE_RESET_TIME = 120000
const l58 = require('../components/GeoJson/L_58_1.json');
const l50_2 = require('../components/GeoJson/L_50_2.json');
const l50a1 = require('../components/GeoJson/L_50A_1.json')
const l75 = require('../components/GeoJson/L_75_1.json')
const l122 = require('../components/GeoJson/L_122_2.json')
const l50_1 = require('../components/GeoJson/L_50_1.json');
const l59_1 = require('../components/GeoJson/L_59_1.json');
const l86_1 = require('../components/GeoJson/L_86_1.json');

let geojsondata = l58.concat(l50_2).concat(l75).concat(l50a1).concat(l122).concat(l50_1).concat(l59_1).concat(l86_1)

export default function Dott() {
  
  const { settings } = useSettings();
  const mapComponent = useMemo(() => (
    <Map center={[(settings?.userLocation?.long||3.71667),(settings?.userLocation?.lat||51.05)]} zoom={16}>
      {({ TileLayer, Marker, Popup, GeoJSON }) => (
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {settings.isMicroMobilityMode && (
            <>
              {settings.microMobilityMode.dott && (<DottOrBoltMarkers DatasetName={DOTT_DATASET_NAME} Marker={Marker} Popup={Popup} />)}
              {settings.microMobilityMode.bolt && (<DottOrBoltMarkers DatasetName={BOLT_DATASET_NAME} Marker={Marker} Popup={Popup} />)}
              {settings.microMobilityMode.bluebike && (<BlueBikeMarkers Marker={Marker} Popup={Popup} />)}
              {settings.microMobilityMode.donkey && (<DonkeyMarkers Marker={Marker} Popup={Popup} />)}
            </>
          )}
          {settings.isPublicTransit && (
            <>
              {settings.publicTransit.nmbs && <NmbsMarkers Marker={Marker} Popup={Popup} />}
              {settings.publicTransit.nmbs && <GeoJSON data={geojsondata} />}
              {settings.publicTransit.autocars && <AutoCarsMarkers Marker={Marker} Popup={Popup} />}
              {settings.publicTransit.delijn && <DeLijnMarkers Marker={Marker} Popup={Popup} />}
            </>
          )}
        </>
      )}
    </Map>
  ), [settings]);

  return (
    <Layout>
      <Head>
        <title>Ghent Rental Bike</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          {mapComponent}
        </Container>
      </Section>
    </Layout>
  );
}
