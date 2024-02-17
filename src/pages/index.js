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
  //const url = (skip, limit) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/records?limit=${limit}&skip=${skip}`;
  const url = (limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/records?order_by=100&limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;

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
      const storageData = localStorage.getItem('dottData');
      const storageTimestamp = localStorage.getItem('dottDataTimestamp');
      const currentTime = new Date().getTime();
      let data = [];

      if (storageData && storageTimestamp && currentTime - storageTimestamp < 120000) { // 2 minutes in milliseconds
        data = JSON.parse(storageData);
      } else {
        let limit = 100;
        let offset = 0;
        // Keep fetching until all data is fetched
        while (offset < totalCount) {
          const customUrl = url(limit, offset);
          console.log("customURl", customUrl);
          const response = await axios.get(customUrl);
          data = data.concat(response.data.results);
          offset += limit;
        }
        localStorage.setItem('dottData', JSON.stringify(data));
        localStorage.setItem('dottDataTimestamp', currentTime.toString());
      }
      setDottData(data);
      setDottLocations(data.map((result) => [result?.lat, result?.lon]));
    }
    if (totalCount > 0) {
      fetchData();
    }
  }, [totalCount]);

  console.log("dottData", dottData);

  /**
   * Generates style object based on the current range in meters.
   * Red when less than 5 km
   * Orange when less than 15 km
   * Green when more than 15 km
   * @param {number} current_range_meters - The current range in meters.
   * @returns {Object} The style object with a color property.
   */
  const generateStyles = (current_range_meters) => {
    //TODO replace by SCSS
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
          {dottData && (
            <Map className={styles.homeMap} width="800" height="400" center={dottLocations[0] || DEFAULT_CENTER} zoom={13}>
              {({ TileLayer, Marker, Popup }) => (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  />
                  {/* Render markers only if dottData is available */}
                  {dottData &&
                    dottData.map((bike) => (
                      bike?.lat && bike?.lon && (
                        <Marker color="red" key={bike.bike_id} position={[bike.lat, bike.lon]} icon={L.icon({
                          iconUrl: '/leaflet/images/dott.png',
                          iconSize: [25, 25]
                        })}>

                          <Popup>
                            <div>
                              <h2>Dott Bike{bike.bike_id}</h2>
                              <p style={generateStyles(bike?.current_range_meters)}><b>Current Range: </b>{(bike?.current_range_meters / 1000).toFixed(2)}km</p>
                              <Button href={JSON.parse(bike?.rental_uris).android}>Rent on Android</Button>
                              <Button href={JSON.parse(bike?.rental_uris).ios}>Rent on iOS</Button>
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
