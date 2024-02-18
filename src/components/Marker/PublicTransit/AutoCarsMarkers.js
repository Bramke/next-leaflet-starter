import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Button from '@components/Button';

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
              <div>
                <h2>Halte {markerData.data[company].name}</h2>
                <p>{markerData.data[company].description}</p>
                <Button onClick={() => window.open(markerData.data[company].website, '_blank')}>
                  Open website
                </Button>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </>
  )
}
