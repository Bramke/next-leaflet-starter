import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { fs, Button } from 'nextjs-components';

export default function NmbsMarkers({ Marker, Popup }) {
  const { data: markerData } = useSWR('/api/publicTransit/nmbs', axios);

  return (
    <>
      {['GENT-DAMPOORT', 'GENT-SINT-PIETERS', 'GENTBRUGGE', 'DRONGEN', 'EVERGEM', 'WONDELGEM', 'MERELBEKE'].map((station) => (
        markerData?.data?.[station] && (
          <Marker key={station} position={[markerData.data[station].lat, markerData.data[station].lon]}
            icon={L.icon({
                iconUrl: `/leaflet/images/nmbs.jpeg`,
                iconSize: [40, 40]
              })}
          >
            <Popup>
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Halte {markerData.data[station].naam}</fs.Title>
                  <fs.Subtitle>Stiptheid: {(markerData.data[station].stiptheid).toFixed(2)}%</fs.Subtitle>
                </fs.Content>
                <fs.Footer>
                  <fs.Footer.Actions>
                    <Button onClick={() => window.open(`http://www.belgianrail.be/nl/stations-en-trein/zoek-een-station/11/${markerData.data[station].naam}.aspx`, '_blank')}>
                      Halte Info
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