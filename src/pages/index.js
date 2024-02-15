import Head from 'next/head';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import axios from 'axios';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@components/Map'), { ssr: false }); // Dynamically import Map component

const DEFAULT_CENTER = [51.05, 3.71667];

export default function Dott() {
  const [dottData, setDottData] = useState(null);
  const [dottLocations, setDottLocations] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const url = (skip, limit) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/records?limit=${limit}&skip=${skip}`;
  useEffect(() => {    
    axios
      .get('https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/records?limit=1')
      .then((response) => {
        setTotalCount(response.data.total_count);
      });
  }, []);

  console.log("dottData", dottData);

  useEffect(() => {
    const fetchData = async () => {
      let skip = 0;
      let limit = 20;
      let data = [];
      try {
        while (skip < totalCount) {
          const customUrl = url(skip, limit);
          const response = await axios.get(customUrl);
          data = data.concat(response.data.results);
          skip += limit;
        }
        setDottData(data);
        setDottLocations(data.map((result) => [result?.lat, result?.lon]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (totalCount > 0) {
      fetchData();
    }
  }, [totalCount]);

  const generateStyles = (current_range_meters) => {
    // if less than 5 km red
    // if less than 15 km orange
    // more than 15 km green
    if (current_range_meters < 5000) {
      return {
        color: 'red'
      };
    } else if (current_range_meters < 15000) {
      return {
        color: 'orange'
      };
    }
    return {
      color: 'green'
    };
  }

  return (
    <Layout>
      <Head>
        <title>Dott Map</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>Dott Map</h1>
          {dottData &&(
          <Map className={styles.homeMap} width="800" height="400" center={dottLocations[0] || DEFAULT_CENTER} zoom={13}>
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {/* Render markers only if dottData is available */}
                {dottData &&
                  dottData.map((result) => (
                    result?.lat && result?.lon && (
                      <Marker color="red" key={result.recordid} position={[result.lat, result.lon]} icon={L.icon({
                        iconUrl: '/leaflet/images/dott.png',
                        iconSize: [25, 25]
                      })}>

                        <Popup>
                          <div>
                            <h2>Dott Bike</h2>
                            <p style={generateStyles(result?.current_range_meters)}><b>Current Range: </b>{(result?.current_range_meters / 1000).toFixed(2)}km</p>
                            {/* //Create buttons for ios and android rental
                            rental_urls {"android": "https://go.ridedott.com/vehicles/506MZ5?platform=android", "ios": "https://go.ridedott.com/vehicles/506MZ5?platform=ios"}
                            this is a string not an object */}
                            <Button href={JSON.parse(result?.rental_uris).android}>Rent on Android</Button>
                            <Button href={JSON.parse(result?.rental_uris).ios}>Rent on iOS</Button>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}
              </>
            )}
          </Map>
          )}
        </Container>
      </Section>
    </Layout>
  );
}
