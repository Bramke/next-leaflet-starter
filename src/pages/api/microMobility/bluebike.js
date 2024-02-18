// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const DATASET_NAMES = ['blue-bike-deelfietsen-gent-sint-pieters-m-hendrikaplein', 'blue-bike-deelfietsen-gent-dampoort', 'blue-bike-deelfietsen-gent-sint-pieters-st-denijslaan', 'blue-bike-deelfietsen-merelbeke-drongen-wondelgem'];

export default async (req, res) => {
  const url = (datasetName) => `https://data.stad.gent/api/explore/v2.1/catalog/datasets/${datasetName}/records?offset=0&timezone=UTC&include_links=true&include_app_metas=false`;
  const getData = async () => {
    const gentSintPieters = await axios.get(url(DATASET_NAMES[0])).then((response) => response.data.results[0]);
    const dampoort = await axios.get(url(DATASET_NAMES[1])).then((response) => response.data.results[0]);
    const sintPietersDenijslaan = await axios.get(url(DATASET_NAMES[2])).then((response) => response.data.results[0]);
    const merelbeke = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Merelbeke"));
    const drongen = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Drongen"));
    const wondelgem = await axios.get(url(DATASET_NAMES[3])).then((response) => response.data.results.find((item) => item.name === "Station Wondelgem"));

    return {
      gentSintPieters,
      dampoort,
      sintPietersDenijslaan,
      merelbeke,
      drongen,
      wondelgem
    };
  };
  
  res.statusCode = 200
  await res.json(await getData())
}
