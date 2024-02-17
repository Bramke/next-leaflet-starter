import { useEffect, useState } from 'react'
import axios from 'axios'

export default function DeLijnMarkers({ cookieResetTime, Marker, Popup }) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTotalCount = async () => {
    const response = await axios.get(
      "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bushaltes-gent/records?order_by=1&limit=1&offset=0&timezone=UTC&include_links=false&include_app_metas=false"
    );
    return response.data.total_count
  };

  useEffect(() => {
    fetchTotalCount().then((data) => setTotalCount(data));
  }, []);

  //  'https://data.stad.gent/api/explore/v2.1/catalog/datasets/bushaltes-gent/records?limit=100&offset=0&timezone=UTC&include_links=false&include_app_metas=false' \
  const customUrl = (limit, offset) => {
    return `https://data.stad.gent/api/explore/v2.1/catalog/datasets/bushaltes-gent/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=false&include_app_metas=false`
  }

  const fetchData = async () => {
    let limit = 100
    let offset = 0
    let newData = []
    const storageData = localStorage.getItem('DeLijnData');
    const storageTimestamp = localStorage.getItem('DeLijnDataTimestamp');
    const currentTime = new Date().getTime();

    if (storageData?.length < 0 && storageTimestamp && currentTime - storageTimestamp < cookieResetTime) {
      newData = JSON.parse(storageData);
    } else {
      while (newData.length < totalCount) {
        const response = await axios.get(customUrl(limit, offset))
        console.log(response)
        newData = newData.concat(response.data.results)
        offset += limit
      }
      localStorage.setItem('DeLijnData', JSON.stringify(newData));
      localStorage.setItem('DeLijnDataTimestamp', currentTime.toString());
    }
    return newData;
  }
  useEffect(() => {
    fetchData().then((data) => setData(data))
  }, [totalCount, cookieResetTime])

  return (
    <>
      { data && data.map((halte) => {
        return (
          <Marker key={halte.haltenummer} position={[halte.latitude, halte.longitude]}
           icon={L.icon({
              iconUrl: '/leaflet/images/De_Lijn.png',
              iconSize: [25, 25]
            })}
            >
            <Popup>
              <div style={{ width: '450px'}}>
                <h2>Halte {halte.haltenummer} - De Lijn</h2>
                <p>Halte naam: {halte.omschrijving}</p>
                <iframe src={`https://www.delijn.be/realtime/${halte.haltenummer}/15`} width="320" height="400"></iframe>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}