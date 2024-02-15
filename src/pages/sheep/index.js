import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';
import axios from 'axios';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';

const DEFAULT_CENTER = [51.05, 3.71667]

export default function Home() {

  const [sheepData, setSheepData] = useState(null);
  const [sheepLocation, setSheepLocation] = useState(null);

  useEffect(() => {
    const response = axios.get('https://data.stad.gent/api/explore/v2.1/catalog/datasets/sheep-tracking-gent/records?limit=20').then((response) => {
      setSheepData(response.data.results[0]);
      setSheepLocation([response.data.results[0].location.lat, response.data.results[0].location.lon]);
    });
  }, []);
  console.log(sheepLocation);

  return (
    <Layout>
      <Head>
        <title>Next.js Leaflet Starter</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>
            Next.js Leaflet Starter
          </h1>


          {sheepLocation && (
            <>
            <p className={styles.description}>
              The sheep is currently located at {sheepLocation[0]}, {sheepLocation[1]}
            </p>
          <Map className={styles.homeMap} width="800" height="400" center={sheepLocation||DEFAULT_CENTER} zoom={12}>
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={sheepLocation||DEFAULT_CENTER} icon={L.icon({ iconUrl: '/leaflet/images/sheep.png', iconSize: [35, 35] })}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </>
            )}
          </Map>
          </>
          )}

          <p className={styles.description}>
            <code className={styles.code}>npx create-next-app -e https://github.com/colbyfayock/next-leaflet-starter</code>
          </p>

          <p className={styles.view}>
            <Button href="https://github.com/colbyfayock/next-leaflet-starter">Vew on GitHub</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}