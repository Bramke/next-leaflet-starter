// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async (req, res) => {
  const getTotalCount = async () => {
    const response = await axios.get(
      "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bushaltes-gent/records?order_by=1&limit=1&offset=0&timezone=UTC&include_links=false&include_app_metas=false"
    );
    return response.data.total_count
  };
  const datasetUrl = (limit, offset) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/bushaltes-gent/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=false&include_app_metas=false`;
  const totalCount = await getTotalCount()
  const fetchDottData = async () => {
    let limit = 100;
    let offset = 0
    let data = []
    while (data.length < totalCount) {
      const response = await axios.get(datasetUrl(limit, offset))
      data = data.concat(response.data.results)
      offset += limit
    }
    return data
  }
  res.statusCode = 200
  await res.json({ totalCount: await getTotalCount(), buses: await fetchDottData() })
}
