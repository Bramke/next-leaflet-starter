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
  //example url   'https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?order_by=100&limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false' \
  const createUrl = (limit, offset) => {
    return `https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`
  }
  /*
  {
    "_links": [
        {
            "rel": "self",
            "href": "https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records/"
        }
    ],
    "station_id": "12392",
    "num_bikes_available": 3,
    "num_docks_available": 3,
    "is_renting": 1,
    "is_installed": 1,
    "is_returning": 1,
    "last_reported": "1708070338",
    "geopunt": {
        "lon": 3.7159931,
        "lat": 51.0630685
    },
    "name": "Opgeëistenlaan 401"
  }
  */
 console.log("kjdmfqdmlkjmlkqjm totalCount", totalCount)
  const getDonkeyData = async () => {
    console.log("kjdmfqdmlkjmlkqjm getDonkeyData")
    let limit = 100;
    let offset = 0;
    let newData = [];
    while (offset < totalCount) {
      const url = createUrl(limit, offset);
      const response = await axios.get(url);

      console.log("kjdmfqdmlkjmlkqjm", offset)
      newData = newData.concat(response.data.results);
      offset += limit;
    }
    // Filter out those without geopunt
    newData = newData.filter((station) => station.geopunt);
    // Filter out num_bikes_available = 0
    newData = newData.filter((station) => station.num_bikes_available > 0);
    // Set donkeyData in local storage
    localStorage.setItem('donkeyData', JSON.stringify(newData));
    return newData;
  }

  useEffect(() => {
    const storageData = localStorage.getItem('donkeyData');
    const storageTimestamp = localStorage.getItem('donkeyDataTimestamp');
    const currentTime = new Date().getTime();
    console.log("kjdmfqdmlkjmlkqjm useEffect")

    if (storageData && storageTimestamp && (currentTime - storageTimestamp < cookieResetTime || storageData.length < 0)) {
      setData(JSON.parse(storageData));
    } else {
      getDonkeyData().then((data) => {
        
        setData(data);
        localStorage.setItem('donkeyData', JSON.stringify(data));
        localStorage.setItem('donkeyDataTimestamp', currentTime.toString());
      });
    }
  }, []);

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

