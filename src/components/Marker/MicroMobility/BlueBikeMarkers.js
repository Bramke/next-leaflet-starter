import React, { useState, useEffect } from 'react';
import { fs, Button } from 'nextjs-components';

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
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Blue Bike {bikeData.name}</fs.Title>
                  <fs.Subtitle><b>Currently available: </b>{bikeData.bikes_in_use} / {bikeData.bikes_available}</fs.Subtitle>
                </fs.Content>
                <fs.Footer>
                <fs.Footer.Status>
                  <Button href='https://www.blue-bike.be/'>
                    Meer Info
                </Button>
                </fs.Footer.Status>
                  <fs.Footer.Actions>
                <Button href='https://www.blue-bike.be/en/pricing/'>
                    Tarieven
                </Button>
                  </fs.Footer.Actions>
                </fs.Footer>
              </fs.Fieldset>
            </Popup>
          </Marker>
        )
      ))}
    </>
  );
}
