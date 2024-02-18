import React, { useState, useEffect } from 'react';
import Button from '@components/Button';

import axios from 'axios';
import useSWR from 'swr'



export default function BlueBikeMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/microMobility/bluebike', axios);

  return (
    <>
      {markerData?.data && Object.values(markerData.data).map((bikeData) => (
        bikeData.bikes_available && (
          <Marker color="blue" key={bikeData.id} position={[bikeData.latitude, bikeData.longitude]}
          icon={L.icon({
              iconUrl: '/leaflet/images/bluebikelogo.png',
              iconSize: [30, 30]
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
