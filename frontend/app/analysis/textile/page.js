import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function TextileAnalysisPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-playfair text-4xl md:text-5xl text-center">Textile Analysis</h1>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Upload an image to identify fabric types, textures, and materials using our AI-powered recognition
            technology.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl bg-white rounded-lg shadow-md p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4 text-center">Drag and drop an image here, or click to select a file</p>
            <Button>Upload Image</Button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">How it works</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
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

