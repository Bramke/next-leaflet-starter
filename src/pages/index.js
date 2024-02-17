import Head from 'next/head';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import axios from 'axios';

import styles from '@styles/Home.module.scss';
import { useEffect, useState, useRef } from 'react';

const Map = dynamic(() => import('@components/Map'), { ssr: false }); // Dynamically import Map component

const DEFAULT_CENTER = [51.05, 3.71667];
const DOTT_DATASET_NAME = 'dott-deelfietsen-gent';
const BOLT_DATASET_NAME = 'bolt-deelfietsen-gent';
const COOKIE_RESET_TIME = 120000

export default function Dott() {
  const datasetUrl = (datasetName, limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/${datasetName}/records?order_by=100&limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;

  /**
   * DOTT
   */
  const [dottData, setDottData] = useState(null);
  const [dottLocations, setDottLocations] = useState(null);
  const [totalDottCount, setTotalDottCount] = useState(null);

  useEffect(() => {
    axios
      .get(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/${DOTT_DATASET_NAME}/records?limit=1`)
      .then((response) => {
        setTotalDottCount(response.data.total_count);
      });
  }, []);

  const fetchDottData = async () => {
    const storageData = localStorage.getItem('dottData');
    const storageTimestamp = localStorage.getItem('dottDataTimestamp');
    const currentTime = new Date().getTime();
    let data = [];

    if (storageData && storageTimestamp && currentTime - storageTimestamp < COOKIE_RESET_TIME) { // 2 minutes in milliseconds
      data = JSON.parse(storageData);
    } else {
      let limit = 100;
      let offset = 0;
      // Keep fetching until all data is fetched
      while (offset < totalDottCount) {
        const customDottUrl = datasetUrl(DOTT_DATASET_NAME, limit, offset);
        const response = await axios.get(customDottUrl);
        data = data.concat(response.data.results);
        offset += limit;
      }
      // Clean the data
      // Only keep valid long, lad data
      data = data.filter((result) => result?.lat && result?.lon);
      // Only keep non disabled bikes
      data = data.filter((result) => result?.is_disabled === 0);
      // Remove duplicates
      data = data.filter((result, index, self) => self.findIndex((t) => t.bike_id === result.bike_id) === index);
      localStorage.setItem('dottData', JSON.stringify(data));
      localStorage.setItem('dottDataTimestamp', currentTime.toString());
    }
    setDottData(data);
    setDottLocations(data.map((result) => [result?.lat, result?.lon]));
  }

  useEffect(() => {
    if (totalDottCount > 0) {
      fetchDottData();
    }
  }, [totalDottCount]);

  /**
   * BOLT
   */

  const [boltData, setBoltData] = useState(null);
  const [boltLocations, setBoltLocations] = useState(null);
  const [totalBoltCount, setTotalBoltCount] = useState(null);

  useEffect(() => {
    axios
      .get(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/${BOLT_DATASET_NAME}/records?limit=1`)
      .then((response) => {
        setTotalBoltCount(response.data.total_count);
      });
  }, []);

  const fetchBoltData = async () => {
    const storageData = localStorage.getItem('boltData');
    const storageTimestamp = localStorage.getItem('boltDataTimestamp');
    const currentTime = new Date().getTime();
    let boltData = [];

    if (storageData && storageTimestamp && currentTime - storageTimestamp < COOKIE_RESET_TIME) { // 2 minutes in milliseconds
      boltData = JSON.parse(storageData);
    } else {
      let limit = 100;
      let offset = 0;
      // Keep fetching until all data is fetched
      while (offset < totalBoltCount) {
        const customBoltUrl = datasetUrl(BOLT_DATASET_NAME, limit, offset);
        console.log("customBoltUrl", customBoltUrl);
        const response = await axios.get(customBoltUrl);
        console.log("res data", response.data)
        boltData = boltData.concat(response.data.results);
        offset += limit;
      }
      // Clean the data
      // Only keep valid long, lad data
      boltData = boltData.filter((result) => result?.lat && result?.lon);
      // Only keep non disabled bikes
      boltData = boltData.filter((result) => result?.is_disabled === 0);
      // Remove duplicates
      boltData = boltData.filter((result, index, self) => self.findIndex((t) => t.bike_id === result.bike_id) === index);
      localStorage.setItem('boltData', JSON.stringify(boltData));
      localStorage.setItem('boltDataTimestamp', currentTime.toString());
      console.log("boltData", boltData)
    }
    setBoltData(boltData);
    setBoltLocations(boltData.map((result) => [result?.lat, result?.lon]));
  }

  useEffect(() => {
    if (totalBoltCount > 0) {
      fetchBoltData();
    }
  }, [totalBoltCount]);

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
          {dottData && boltData && (
            <Map className={styles.homeMap} center={userLocation} zoom={16}>
              {({ TileLayer, Marker, Popup, useMap }) => (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  />
                  {dottData &&
                    dottData.map((bike) => (
                      bike?.lat && bike?.lon && (
                        <Marker color="red" key={bike.bike_id} position={[bike.lat, bike.lon]} icon={L.icon({
                          iconUrl: '/leaflet/images/dott.png',
                          iconSize: [25, 25]
                        })}>

                          <Popup>
                            <div>
                              <h2>Dott Bike</h2>
                              <p style={generateStyles(bike?.current_range_meters)}><b>Current Range: </b>{(bike?.current_range_meters / 1000).toFixed(2)}km</p>
                              <Button href={JSON.parse(bike?.rental_uris).android}>Rent on Android</Button>
                              <Button href={JSON.parse(bike?.rental_uris).ios}>Rent on iOS</Button>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  {boltData &&
                    boltData.map((bike) => (
                      bike?.lat && bike?.lon && (
                        <Marker
                          color="red"
                          key={bike.bike_id}
                          position={[bike.lat, bike.lon]}
                          icon={L.icon({
                            iconUrl: '/leaflet/images/bolt.png',
                            iconSize: [25, 25]
                          })}
                        >

                          <Popup>
                            <div>
                              <h2>Bolt Bike</h2>
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

