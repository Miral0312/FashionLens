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

export default function PatternAnalysisPage() {
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
    formData.append("model_type", "pattern") // Specific for pattern detection

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

  const renderPatternChart = (data) => {
    const labels = Object.keys(data)
    const values = Object.values(data)

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Pattern Frequency",
          data: values,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
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

    return <Bar data={chartData} options={options} />
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-playfair text-4xl md:text-5xl text-center">Pattern Analysis</h1>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Upload a ZIP of patterned fabric or fashion items to detect and classify patterns using AI.
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

          {results?.pattern && (
            <div className="mt-10 space-y-6">
              <h3 className="text-xl font-semibold">Detected Pattern Types</h3>
              {renderPatternChart(results.pattern)}
            </div>
          )}

          <div className="mt-12">
            <h3 className="font-semibold text-lg mb-4">How it works</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Upload a ZIP of images with patterned fashion items</li>
              <li>Our AI analyzes the visual patterns (e.g., floral, checkers, stripes)</li>
              <li>You get a breakdown of detected styles and trends</li>
              <li>Use this data for design inspiration, research, or product tagging</li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
