"use client"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function TextileAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("user_id", "textile-user")
    formData.append("model_type", "textile")

    try {
      setLoading(true)

      for (let [key, value] of formData.entries()) {
        console.log(`FormData -> ${key}:`, value)
      }

      const response = await axios.post("http://localhost:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("Backend response:", response.data) 

      if (response.data?.results?.textile) {
        const textileResults = response.data.results.textile

        console.log("Textile results:", textileResults)
        console.log("Raw textile JSON:", JSON.stringify(textileResults, null, 2))

        // Count fabric types
        const fabricCounts: { [key: string]: number } = {}
        Object.values(textileResults).forEach((fabric) => {
          fabricCounts[fabric] = (fabricCounts[fabric] || 0) + 1
        })

        const labels = Object.keys(fabricCounts)
        const values = Object.values(fabricCounts)

        setResult({ labels, values })
      } else {
        console.log("Full response structure:", response.data)
        setResult("No textile data received from the backend. Please check server logs.")
      }
    } catch (error: any) {
      console.error("Error analyzing textile:", error)
      setResult(`Error: ${error?.response?.data?.message || error.message || "Error analyzing fabric."}`)
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setFile(null)
  }

  const chartData = {
    labels: result?.labels || [],
    datasets: [
      {
        label: 'Fabric Types',
        data: result?.values || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold">Textile Analysis</h1>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            Upload an image to identify fabric types, textures, and materials using our AI-powered recognition
            technology.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
          {result && result.labels ? (
            <div className="text-center space-y-6">
              <div className="text-gray-800">
                <h4 className="text-xl font-semibold">Predicted Fabrics:</h4>
                <div className="h-64 w-full">
                  <Bar data={chartData} />
                </div>
              </div>
              <Button onClick={resetAnalysis} className="mt-4">
                Analyze Another Image
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center hover:border-gray-400 transition cursor-pointer text-center"
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                  handleUploadClick()
                }
              }}
            >
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                {file ? file.name : "Drag and drop an image here, or click to select a file"}
              </p>
              <Button disabled={!file || loading} onClick={(e) => {
                e.stopPropagation()
                handleAnalyze()
              }}>
                {loading ? "Analyzing..." : "Upload Image"}
              </Button>
              <input
                type="file"
                accept="image/*,.zip,.rar"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-4">How it works</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-600 text-sm md:text-base">
              <li>Upload a close-up image of a fabric or textile</li>
              <li>Our AI analyzes the image to identify the material type</li>
              <li>Receive detailed information about texture, composition, and properties</li>
              <li>Use the insights for your fashion design, sourcing, or sustainability analysis</li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
