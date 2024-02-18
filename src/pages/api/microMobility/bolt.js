// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async (req, res) => {
  const dottDatasetName = 'bolt-deelfietsen-gent'
  const getTotalCount = async () => {
    const response = await axios.get(`https://data.stad.gent/api/explore/v2.1/catalog/datasets/${dottDatasetName}/records?limit=1`);
    return response.data.total_count;
  }
  const datasetUrl = (limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/${dottDatasetName}/records?order_by=100&limit=${limit}&offset=${offset}&timezone=UTC&include_links=true&include_app_metas=false`;
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
     // Clean the data
      // Only keep valid long, lad data
      data = data.filter((result) => result?.lat && result?.lon);
      // Only keep non disabled bikes
      data = data.filter((result) => result?.is_disabled === 0);
      // Remove duplicates
      data = data.filter((result, index, self) => self.findIndex((t) => t.bike_id === result.bike_id) === index);

      return data
  }
  res.statusCode = 200
  await res.json({ totalCount: await getTotalCount(), bikes: await fetchDottData() })
}
