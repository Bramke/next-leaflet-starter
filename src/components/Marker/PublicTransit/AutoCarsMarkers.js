import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { fs, Button } from 'nextjs-components';

export default function AutoCarsMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/publicTransit/autocars', axios);

  return (
    <>
      {['flixbus', 'flibco', 'eurolines'].map((company) => (
        markerData?.data?.[company] && (
          <Marker key={markerData.data[company].name} position={[markerData.data[company].latitude, markerData.data[company].longitude]}
            icon={L.icon({
                iconUrl: `/leaflet/images/${company}.png`,
                iconSize: [40, 40]
              })}
          >
            <Popup>
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Halte {markerData.data[company].name}</fs.Title>
                  <fs.Subtitle>{markerData.data[company].description}</fs.Subtitle>
                </fs.Content>
                <fs.Footer>
                  <fs.Footer.Actions>
                  <Button onClick={() => window.open(markerData.data[company].website, '_blank')}>
                  Website
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
