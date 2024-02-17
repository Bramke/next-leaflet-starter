import React, { useState, useEffect } from 'react';
import Button from '@components/Button';

import axios from 'axios';

const DATASET_NAMES = ['blue-bike-deelfietsen-gent-sint-pieters-m-hendrikaplein', 'blue-bike-deelfietsen-gent-dampoort', 'blue-bike-deelfietsen-gent-sint-pieters-st-denijslaan', 'blue-bike-deelfietsen-merelbeke-drongen-wondelgem'];

export default function BlueBikeMarkers({ cookieResetTime, Marker, Popup }) {
  const url = (datasetName) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/${datasetName}/records?offset=0&timezone=UTC&include_links=true&include_app_metas=false`;

  const getData = async () => {
    const gentSintPieters = await axios.get(url(DATASET_NAMES[0])).then((response) => response.data.results[0]);
    const dampoort = await axios.get(url(DATASET_NAMES[1])).then((response) => response.data.results[0]);
    const sintPietersDenijslaan = await axios.get(url(DATASET_NAMES[2])).then((response) => response.data.results[0]);
    const merelbeke = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Merelbeke"));
    const drongen = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Drongen"));
    const wondelgem = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Wondelgem"));

    return {
      gentSintPieters,
      dampoort,
      sintPietersDenijslaan,
      merelbeke,
      drongen,
      wondelgem
    };
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const storageData = localStorage.getItem('blueBikeData');
    const storageTimestamp = localStorage.getItem('blueBikeDataTimestamp');
    const currentTime = new Date().getTime();

    if (storageData && storageTimestamp && currentTime - storageTimestamp < cookieResetTime) {
      setData(JSON.parse(storageData));
    } else {
      getData().then((data) => {
        setData(data);
        localStorage.setItem('blueBikeData', JSON.stringify(data));
        localStorage.setItem('blueBikeDataTimestamp', currentTime.toString());
      });
    }
  }, [cookieResetTime]);

  return (
    <>
      {data && Object.values(data).map((bikeData) => (
        bikeData.bikes_available && (
          <Marker color="blue" key={bikeData.id} position={[bikeData.latitude, bikeData.longitude]}
          icon={L.icon({
              iconUrl: '/leaflet/images/bluebikelogo.png',
              iconSize: [50, 50]
            })}
          >
            <Popup>
              <div>
                <h2>Blue Bike {bikeData.name}</h2>
                <p><b>Currently available: </b>{bikeData.bikes_in_use} / {bikeData.bikes_available}</p>
                <Button href='https://www.blue-bike.be/en/'>
                    More info
                </Button>
                <Button href='https://www.blue-bike.be/en/pricing/'>
                    Pricing info
                </Button>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </>
  );
}
