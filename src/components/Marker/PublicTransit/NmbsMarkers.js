import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Button from '@components/Button';

export default function NmbsMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/publicTransit/nmbs', axios);
  console.log("markerData", markerData?.data)

  return (
    <>
      {['GENT-DAMPOORT', 'GENT-SINT-PIETERS', 'GENTBRUGGE', 'DRONGEN', 'EVERGEM', 'WONDELGEM', 'MERELBEKE'].map((station) => (
        markerData?.data?.[station] && (
          <Marker key={markerData.data[station].name} position={[markerData.data[station].lat, markerData.data[station].lon]}
            icon={L.icon({
                iconUrl: `/leaflet/images/nmbs.jpeg`,
                iconSize: [40, 40]
              })}
          >
            <Popup>
              <div>
                <h2>Halte {markerData.data[station].naam}</h2>
                <p>Stiptheid: {(markerData.data[station].stiptheid).toFixed(2)}%</p>
                <Button onClick={() => window.open(`http://www.belgianrail.be/nl/stations-en-trein/zoek-een-station/11/${markerData.data[station].naam}.aspx`, '_blank')}>
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