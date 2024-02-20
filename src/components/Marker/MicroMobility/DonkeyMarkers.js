import React, { useEffect, useState } from 'react'
import axios from 'axios';
import useSWR from 'swr'
import { fs, Button, Note } from 'nextjs-components';

import { IconInfoCircle } from '@tabler/icons-react';

export default function DonkeyMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/microMobility/donkey', axios);
  return (
    <>
      {markerData?.data && markerData.data.bikes.map((station) => (
        station.geopunt && (
          <Marker key={station.station_id} position={[station.geopunt.lat, station.geopunt.lon]} icon={L.icon({
            iconUrl: '/leaflet/images/Donkey.png',
            iconSize: [25, 25]
          })}>
            <Popup>
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Donkey Republic Station - {station.name}</fs.Title>
                  <fs.Subtitle>
                  <p style={{ color: station.num_bikes_available > station.num_docks_available ? 'green' : station.num_bikes_available < 1 ? 'red' : station.num_bikes_available < 3 ? 'orange' : 'green' }}>
                    <b>Currently available: </b>{station.num_bikes_available} / {station.num_docks_available}
                  </p>
                    
                  </fs.Subtitle>
                  <Note size="small">
                      Not electric
                    </Note>
                </fs.Content>
                <fs.Footer>
                  <fs.Footer.Actions>
                    <Button href='https://dnky.bike/4I2RIOBOVyb'>
                      More info
                    </Button>
                  </fs.Footer.Actions>
                </fs.Footer>
              </fs.Fieldset>
            </Popup>
          </Marker>
        )
      ))}
    </>
  )
}

