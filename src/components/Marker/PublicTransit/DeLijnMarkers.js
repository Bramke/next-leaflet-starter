import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'

export default function DeLijnMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/publicTransit/delijn', axios);

  return (
    <>
      { markerData?.data && markerData.data.buses.map((halte) => {
        return (
          <Marker key={halte.haltenummer} position={[halte.latitude, halte.longitude]}
            icon={L.icon({
              iconUrl: '/leaflet/images/de_Lijn.png',
              iconSize: [25, 25]
            })}
            >
            <Popup>
              <div style={{ width: '450px'}}>
                <h2 style={{maxWidth: '320px'}}>Halte {halte.omschrijving}</h2>
                <p>Halte nummer: {halte.haltenummer}</p>
                <iframe src={`https://www.delijn.be/realtime/${halte.haltenummer}/15`} width="320" height="400"></iframe>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}