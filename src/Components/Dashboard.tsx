import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import "./Dashboard.css";


interface ThingSpeak {
  created_at: string;
  field1: string;
  field2: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ThingSpeak[]>([]);
  const [loading, setLoading] = useState(true);

  const CHANNEL_ID = "3105818";
  const READ_API_KEY = "URGP71ZC8AHGGCJV";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=20&api_key=${READ_API_KEY}`;
        const response = await axios.get(url);
        setData(response.data.feeds);
      } catch (error) {
        console.error("Error ao buscar dados")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p> Carregando dados...</p>;
  if (data.length === 0) return <p>Nenhum dados encontrado.</p>;

  return (
    <div className="dashboard">
      <h1> Dados Temperatura e Umidade</h1>
      <div className="cards">
        <div className="card">
          <h2> Temperatura</h2>
          <p>{data[data.length - 1].field1}</p>
        </div>
        <div className="card">
          <h2> Umidade</h2>
          <p> {data[data.length - 1].field2}</p>
        </div>
      </div>

      <div className="chart">
        <h3> Temperatura </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']} // ajusta automaticamente mas com margem
              allowDecimals={false}
            />
            <XAxis
              dataKey="created_at"
              tickFormatter={(str) => str.slice(11, 16)} // pega só HH:MM
            />

            <Legend />
            <Line type="monotone" dataKey="field1" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart">
        <h3> Umidade </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(str) => str.slice(11, 16)} // pega só HH:MM
            />

            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="field2" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}