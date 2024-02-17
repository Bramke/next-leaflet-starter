import Button from '@components/Button';
import axios from 'axios';

import { useEffect, useState } from 'react';

const MarkerType = {
  DOT: 'dot',
  BOLT: 'bolt',
}

const DottOrBoltMarkers = ({DatasetName, CookieResetTime, Marker, Popup}) => {
  const datasetUrl = (datasetName, limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/${DatasetName}/records?order_by=100&limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;
  const markerType = DatasetName === "dott-deelfietsen-gent" ? MarkerType.DOT : MarkerType.BOLT;
  /**
   * DOTT
   */
  const [data, setData] = useState(null);
  const [locations, setLocations] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    axios
      .get(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/${DatasetName}/records?limit=1`)
      .then((response) => {
        setTotalCount(response.data.total_count);
      });
  }, []);

  const fetchDottData = async () => {
    const storageData = localStorage.getItem(markerType === MarkerType.DOT ? 'dottData' : 'boltData');
    const storageTimestamp = localStorage.getItem(markerType === MarkerType.DOT ? 'dottDataTimestamp' : 'boltDataTimestamp');
    const currentTime = new Date().getTime();
    let data = [];

    if (storageData && storageTimestamp && currentTime - storageTimestamp < CookieResetTime) { // 2 minutes in milliseconds
      data = JSON.parse(storageData);
    } else {
      let limit = 100;
      let offset = 0;
      // Keep fetching until all data is fetched
      while (offset < totalCount) {
        const customDottUrl = datasetUrl(DatasetName, limit, offset);
        const response = await axios.get(customDottUrl);
        data = data.concat(response.data.results);
        offset += limit;
      }
      // Clean the data
      // Only keep valid long, lad data
      data = data.filter((result) => result?.lat && result?.lon);
      // Only keep non disabled bikes
      data = data.filter((result) => result?.is_disabled === 0);
      // Remove duplicates
      data = data.filter((result, index, self) => self.findIndex((t) => t.bike_id === result.bike_id) === index);
      localStorage.setItem(markerType === MarkerType.DOT ? 'dottData' : 'boltData', JSON.stringify(data)); 
      localStorage.setItem(markerType === MarkerType.DOT ? 'dottDataTimestamp' : 'boltDataTimestamp', currentTime.toString());
    }
    setData(data);
    setLocations(data.map((result) => [result?.lat, result?.lon]));
  }

  useEffect(() => {
    if (totalCount > 0) {
      fetchDottData();
    }
  }, [totalCount]);

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
      {data &&
        data.map((bike) => (
          bike?.lat && bike?.lon && (
            <Marker color="red" key={bike.bike_id} position={[bike.lat, bike.lon]} icon={L.icon({
              iconUrl: markerType === MarkerType.DOT ? '/leaflet/images/dott.png' : '/leaflet/images/bolt.png',
              iconSize: [25, 25]
            })}>

              <Popup>
                <div>
                  <h2>{markerType === MarkerType.DOT ? "Dott Bike" : "Bolt Bike"}</h2>
                  <p style={generateStyles(bike?.current_range_meters)}><b>Current Range: </b>{(bike?.current_range_meters / 1000).toFixed(2)}km</p>
                  <Button href={JSON.parse(bike?.rental_uris).android}>Rent on Android</Button>
                  <Button href={JSON.parse(bike?.rental_uris).ios}>Rent on iOS</Button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
    </>
  );

}

export default DottOrBoltMarkers