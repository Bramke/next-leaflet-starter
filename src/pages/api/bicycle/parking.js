// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', allowedMethods: ['POST'] });
  }

  const { lat, lon } = req.body.geo_point_2d;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Invalid geo_point_2d', message: 'Please provide both lat and lon' });
  }

  // Using a JSON file because the dataset is too large to fetch every time.
  // This function retrieves all the data.
  /*
  const fetchParkingData = async () => {
    const totalCount = await axios.get('https://data.stad.gent/api/explore/v2.1/catalog/datasets/fietsenstallingen-gent/records?limit=1').then((response) => response.data.total_count);
    let limit = 100
    let offset = 0
    let data = []
    const datasetUrl = (limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/fietsenstallingen-gent/records?order_by=100&limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;

    while(offset < totalCount){
      const customDottUrl = datasetUrl(limit, offset);
      const response = await axios.get(customDottUrl);
      data = data.concat(response.data.results);
      offset += limit;
    }

    return data
  }
  */


  const readBikeParkings = async () => {
    // Read the JSON file
    const data = require('./bike_parkings.json');
  
    // Initialize an empty array to store fietsenstalling objects
    const fietsenstallingArray = [];
  
    // Process each data entry and create a fietsenstalling object
    data.forEach(entry => {
      const fietsenstalling = {
        straat: entry.straat || '',
        huisnr: entry.huisnr || '',
        karakter: entry.karakter || '',
        eigenaar: entry.eigenaar || '',
        capaciteit: entry.capaciteit || '',
        openbaar: entry.openbaar || '',
        ondergrond: entry.ondergrond || '',
        bestemming: entry.bestemming || '',
        status: entry.status || '',
        naam: entry.naam || '',
        bezettingsinfo: entry.bezettingsinfo || '',
        geo_point_2d: entry.geo_point_2d || '',
        geometry: entry.geometry || ''
      };
  
      // Push the fietsenstalling object to the array
      fietsenstallingArray.push(fietsenstalling);
    });
  
    return fietsenstallingArray;
  }
  const bikeParkings = await readBikeParkings();
  console.log(bikeParkings.length);
  //filter out the bike parkings that are within 500m of the given lat and lon
  const filterBikeParkings = async (bikeParkings) => {
    const filteredBikeParkings = bikeParkings.filter((bikeParking) => {
      const bikeParkingLat = bikeParking.geo_point_2d.lat;
      const bikeParkingLon = bikeParking.geo_point_2d.lon;
      const distance = Math.sqrt((lat - bikeParkingLat) ** 2 + (lon - bikeParkingLon) ** 2);
      return distance <= 0.003;
    });

    return filteredBikeParkings;
  }
  const filteredBikeParkings = await filterBikeParkings(bikeParkings);
  console.log(filteredBikeParkings.length);
  try {
    res.status(200).json(filteredBikeParkings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
