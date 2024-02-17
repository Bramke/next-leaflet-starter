import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Button from '@components/Button';
import { IconInfoCircle } from '@tabler/icons-react';

export default function DonkeyMarkers({ cookieResetTime, Marker, Popup }) {
  const [data, setData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    //Get total_count
    const url = 'https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false'
    axios.get(url).then((response) => {
      setTotalCount(response.data.total_count);
    });
  }, []);

  const createUrl = (limit, offset) => {
    return `https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`
  }

  const getDonkeyData = async () => {
    let limit = 100;
    let newData = [];
    const fetchData = async () => {
      let offset = 0;
      let fetchedData = [];
      
      do {
        const url = createUrl(limit, offset);
        const response = await axios.get(url);
        fetchedData.push(...response.data.results);
        offset += limit;
      } while (offset < totalCount);
      
      return fetchedData;
    };

    const fetchedData = await fetchData();

    // Filter out stations without geopunt and num_bikes_available = 0
    const cleanedData = fetchedData.filter((station) => station.geopunt && station.num_bikes_available > 0);

    localStorage.setItem('donkeyData', JSON.stringify(cleanedData));
    return cleanedData;
  };

  useEffect(() => {
    const storageData = localStorage.getItem('donkeyData');
    const storageTimestamp = localStorage.getItem('donkeyDataTimestamp');
    const currentTime = new Date().getTime();

    if (storageData && storageTimestamp && currentTime - storageTimestamp < cookieResetTime) {
      setData(JSON.parse(storageData));
    } else {
      getDonkeyData().then((data) => {
        setData(data);
        localStorage.setItem('donkeyData', JSON.stringify(data));
        localStorage.setItem('donkeyDataTimestamp', currentTime.toString());
      });
    }
  }, [cookieResetTime]);

  return (
    <>
      {data && data.map((station) => (
        station.geopunt && (
          <Marker key={station.station_id} position={[station.geopunt.lat, station.geopunt.lon]} icon={L.icon({
              iconUrl: '/leaflet/images/Donkey.png',
              iconSize: [25, 25]
            })}>
            <Popup>
              <div>
                <h2>Donkey Republic Station - {station.name}</h2>
                <p style={{ color: station.num_bikes_available > station.num_docks_available ? 'green' : station.num_bikes_available < 1 ? 'red' : station.num_bikes_available < 3 ? 'orange' : 'green' }}>
                    <b>Currently available: </b>{station.num_bikes_available} / {station.num_docks_available}
                </p>
                <p>
                    <IconInfoCircle size={15} />
                    <b> Non Electric bikes</b>
                </p>
                <Button href='https://dnky.bike/4I2RIOBOVyb'>
                    More info
                </Button>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </>
  )
}

