import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useGeolocated } from 'react-geolocated';
import { fs } from 'nextjs-components';

export default function BycicleParkingMarkers({ Marker, Popup }) {
  const { coords } = useGeolocated();
  const { data: markerData } = useSWR('/api/bicycle/parking', (url) => axios.post(url, { geo_point_2d: { lat: coords.latitude, lon: coords.longitude } }).then((res) => res));

  console.log(markerData);
  if (!coords) {
    // If coords is not defined, return null or any loading indicator
    return null;
  }


  return (
    <>
      {markerData?.data && markerData.data.map((fietsenStalling) => (
        fietsenStalling?.geo_point_2d && (
          <Marker
            key={fietsenStalling.naam+fietsenStalling.geo_point_2d?.lat+fietsenStalling.geo_point_2d?.lon}
            position={[fietsenStalling.geo_point_2d?.lat, fietsenStalling.geo_point_2d?.lon]}
            icon={L.icon({
              iconUrl: `/leaflet/images/bikeparking.svg`,
              iconSize: [15, 15],
            })}
          >
            <Popup>
              <fs.Fieldset>
                <fs.Content>
                  <fs.Title>Fietsenstalling {fietsenStalling.naam}</fs.Title>
                  <fs.Subtitle><b>Capaciteit: </b>{fietsenStalling.capaciteit}</fs.Subtitle>
                  <fs.Subtitle><b>Openbaar: </b>{fietsenStalling.openbaar}</fs.Subtitle>
                  <fs.Subtitle><b>Ondergrond: </b>{fietsenStalling.ondergrond}</fs.Subtitle>
                  <fs.Subtitle><b>Bestemming: </b>{fietsenStalling.bestemming}</fs.Subtitle>
                  <fs.Subtitle><b>Status: </b>{fietsenStalling.status}</fs.Subtitle>
                  {fietsenStalling.bezettingsinf == "False" && <fs.Subtitle><b>Bezettingsinfo: </b>{fietsenStalling.bezettingsinfo}</fs.Subtitle>}
                </fs.Content>
              </fs.Fieldset>
            </Popup>
          </Marker>
        )
      ))}
    </>
  );
}
