// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const STATION_NAMES = ["GENTBRUGGE", "GENT-SINT-PIETERS", "GENT-DAMPOORT", 'DRONGEN', 'EVERGEM', 'WONDELGEM', 'MERELBEKE']
export default async (req, res) => {
  const customUrl = (stationName) => `https://infrabel.opendatasoft.com/api/explore/v2.1/catalog/datasets/maandelijkse-stiptheid-per-stopplaats/records?where=installatienaam_nederlands%3D%22${stationName}%22&limit=100`;
  let stationData = {};
  
  try {
    //Currently using infrabel as a data provider for nmbs, because nmbs has a bad open data system.
    
    const getStationData = async (stationName) => {
      const stationUrl = customUrl(stationName);
      const { data } = await axios.get(stationUrl);
  
      let result = data.results[0];

      let nmbsData = {
        naam: result.installatienaam_nederlands,
        stiptheid: result.stiptheid,
        lat: result.geo_point_2d.lat,
        lon: result.geo_point_2d.lon
      };
      return nmbsData;
    };

    for (let i = 0; i < STATION_NAMES.length; i++) {
      stationData[STATION_NAMES[i]] = await getStationData(STATION_NAMES[i]);
    }
    
    res.status(200).json(stationData); // Send the data back in the response
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
