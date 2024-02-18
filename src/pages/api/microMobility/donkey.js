// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async (req, res) => {
  const dottDatasetName = 'bolt-deelfietsen-gent'
  const getTotalCount = async () => {
    const response = await axios.get(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false`);
    return response.data.total_count;
  }
  const datasetUrl = (limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/donkey-republic-beschikbaarheid-deelfietsen-per-station/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;
  const totalCount = await getTotalCount()
  const fetchDottData = async () => {
    let limit = 100;
    let offset = 0
    let data = []
    while (offset < await totalCount){
      const customDottUrl = datasetUrl(limit, offset);
      const response = await axios.get(customDottUrl);
      data = data.concat(response.data.results);
      offset += limit;
    }
    // Filter out stations without geopunt and num_bikes_available = 0
    data = data.filter((station) => station.geopunt && station.num_bikes_available > 0);

    return data
  }
  res.statusCode = 200
  await res.json({ totalCount: await getTotalCount(), bikes: await fetchDottData() })
}
