'use client';
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
} from "recharts";

export default function PredictionPage() {
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState(null);

  const handleFetch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fetch_trends/${keyword}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data && data.historical_data && data.forecast_data) {
        const historical = data.historical_data.dates.map((date, index) => ({
          ds: date,
          y: data.historical_data.values[index],
        }));

        const forecast = data.forecast_data.dates.map((date, index) => ({
          ds: date,
          yhat1: data.forecast_data.values[index],
        }));

        const combinedData = [...historical, ...forecast];

        setTrendData({
          combined: combinedData,
          peak: {
            ds: data.forecast_data.dates[data.peak_month - 1],
            yhat1: data.forecast_data.values[data.peak_month - 1],
          },
          low: {
            ds: data.forecast_data.dates[data.low_month - 1],
            yhat1: data.forecast_data.values[data.low_month - 1],
          },
        });
      } else {
        console.error("Unexpected data format", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-playfair text-4xl md:text-5xl">Fashion Prediction</h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Explore fashion trends using AI-powered forecasting tools. Enter a keyword to view its Google Trends prediction.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex gap-4 mb-6 justify-center">
            <input
              type="text"
              placeholder="Enter a keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            />
            <button
              onClick={handleFetch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Fetch Trends
            </button>
          </div>

          {trendData ? (
            <LineChart width={800} height={400} data={trendData.combined}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ds" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" name="Historical" dot={false} />
              <Line type="monotone" dataKey="yhat1" stroke="#ff7300" name="Forecast" dot={false} />
              <Scatter data={[trendData.peak]} fill="green" name="Peak Month" shape="circle" />
              <Scatter data={[trendData.low]} fill="red" name="Low Month" shape="circle" />
            </LineChart>
          ) : (
            <p className="text-center text-gray-500">No data to display. Enter a keyword and click "Fetch Trends".</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
