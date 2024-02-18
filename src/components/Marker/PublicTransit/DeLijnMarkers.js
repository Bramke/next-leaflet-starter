import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { Avatar, Entity, EntityField, Menu, MenuButton, MenuItem, MenuWrapper, fs, Button, Text, Code } from 'nextjs-components';

export default function DeLijnMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/publicTransit/delijn', axios);

  return (
    <>
      {markerData?.data && markerData.data.buses.map((halte) => {
        return (
          <Marker key={halte.haltenummer} position={[halte.latitude, halte.longitude]}
            icon={L.icon({
              iconUrl: '/leaflet/images/de_Lijn.svg',
              iconSize: [25, 25]
            })}
          >
            <Popup>
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Halte {halte.omschrijving}</fs.Title>
                  <fs.Subtitle>{halte.haltenummer}</fs.Subtitle>
                  <iframe src={`https://www.delijn.be/realtime/${halte.haltenummer}/15`} width="270" height="400" />
                </fs.Content>
                <fs.Footer>
                  <fs.Footer.Status>
                    <Button size="small" onClick={() => window.open(`sms:4884&body=DLD`)}>SMS Ticket</Button>
                  </fs.Footer.Status>
                  <fs.Footer.Actions>
                    <Button size="small" onClick={() => window.open(`https://www.delijn.be/en/haltes/${halte.haltenummer}/`)}>Halte Info</Button>
                  </fs.Footer.Actions>
                </fs.Footer>
              </fs.Fieldset>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}