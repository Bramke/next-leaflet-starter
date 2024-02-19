import axios from 'axios';
import useSWR from 'swr'

import { fs, Button } from 'nextjs-components';


const MarkerType = {
  DOT: 'dot',
  BOLT: 'bolt',
}

const DottOrBoltMarkers = ({DatasetName, Marker, Popup}) => {
  const markerType = DatasetName === "dott-deelfietsen-gent" ? MarkerType.DOT : MarkerType.BOLT;
  
  const { data: markerData } = useSWR(markerType === MarkerType.DOT ? '/api/microMobility/dott' : '/api/microMobility/bolt', axios);
   /**
   * Generates style object based on the current range in meters.
   * Red when less than 5 km
   * Orange when less than 15 km
   * Green when more than 15 km
   * @param {number} current_range_meters - The current range in meters.
   * @returns {Object} The style object with a color property.
   */
  const generateStyles = (current_range_meters) => {
    //TODO replace by SCSS
    if (current_range_meters < 5000) {
      return {
        color: 'red'
      };
    } else if (current_range_meters < 15000) {
      return {
        color: 'orange'
      };
    }
    return {
      color: 'green'
    };
  }

  return (
    <>
      {markerData?.data &&
        markerData.data.bikes.map((bike) => (
          bike?.lat && bike?.lon && (
            <Marker color="red" key={bike.bike_id} position={[bike.lat, bike.lon]} icon={L.icon({
              iconUrl: markerType === MarkerType.DOT ? '/leaflet/images/dott.png' : '/leaflet/images/bolt.png',
              iconSize: [25, 25]
            })}>

              <Popup>
                <fs.Fieldset>
                <fs.Content>
                  <fs.Title>{markerType === MarkerType.DOT ? "Dott Bike" : "Bolt Bike"}</fs.Title>
                  {/* <fs.Subtitle><IconInfoCircle size={15} />
                    <b> Non Electric bikes</b></fs.Subtitle> */}
                    <p style={generateStyles(bike?.current_range_meters)}><b>Current Range: </b>{(bike?.current_range_meters / 1000).toFixed(2)}km</p>
                </fs.Content>
                <fs.Footer>
                  <fs.Footer.Actions>
                    <Button href={bike?.rental_uris.ios}>Rent Bike</Button>
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

export default DottOrBoltMarkers