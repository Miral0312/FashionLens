'use client'

import React, { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function AllInOneAnalysisPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults(null)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a ZIP file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("model_type", "all_in_one")

    setLoading(true)
    try {
      const response = await fetch("http://localhost:4000/business/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Upload failed")

      setResults(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderResultList = (data) => (
    <ul className="list-disc pl-6 text-gray-700">
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          {key}: <strong>{value}</strong>
        </li>
      ))}
    </ul>
  )

  const renderBarChart = (title, data, color = "rgba(75, 192, 192, 0.6)") => {
    const labels = Object.keys(data)
    const values = Object.values(data)

    const chartData = {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: color,
          borderColor: color.replace("0.6", "1"),
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    }

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <Bar data={chartData} options={options} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-playfair text-4xl md:text-5xl text-center">All-in-One Analysis</h1>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Upload an image for comprehensive analysis combining garment, color, textile, and pattern recognition in a single service.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl bg-white rounded-lg shadow-md p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <input type="file" accept=".zip" onChange={handleFileChange} className="mb-4" />
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? "Analyzing..." : "Upload ZIP"}
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>

          {results && (
            <div className="mt-10 space-y-8">
              {results.garment && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">👗 Garment Detection</h3>
                  {renderBarChart("Garment Types", results.garment, "rgba(54, 162, 235, 0.6)")}
                </div>
              )}

              {results.color && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">🎨 Color Analysis</h3>
                  {renderBarChart("Colors", results.color, "rgba(255, 99, 132, 0.6)")}
                </div>
              )}

              {results.pattern && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">🧵 Pattern Recognition</h3>
                  {renderBarChart("Patterns", results.pattern, "rgba(153, 102, 255, 0.6)")}
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <h3 className="font-semibold text-lg mb-4">How it works</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Upload a ZIP file of fashion images</li>
              <li>AI performs combined detection for garments, colors, and patterns</li>
              <li>Results are shown in detailed charts with counts</li>
              <li>Use insights for design, marketing, or styling strategy</li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
