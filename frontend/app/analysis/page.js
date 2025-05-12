import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AnalysisPage() {
  const analysisOptions = [
    {
      title: "Garment Analysis",
      description:
        "Identify and classify garment types, styles, and features using advanced computer vision algorithms.",
      link: "/analysis/garment",
      image: "https://img.freepik.com/premium-photo/women-s-aesthetic-minimal-fashion-pastel-clothes-made-washed-linen-stylish-female-blouses-dresses-pants-shirts-hanger-white-background-fashion-blog-website-social-media_408798-9507.jpg",
    },
    {
      title: "Color Analysis",
      description: "Extract and analyze color palettes, trends, and combinations from fashion items and collections.",
      link: "/analysis/color",
      image:
        "https://www.verywellmind.com/thmb/pf-eJTOWeSv5PcXHFJ1WsMouLWw=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc()/ColorAnalysis-b-final-62d94df5a6f64ec5a044df5b6c086f90.jpg",
    },
    {
      title: "Textile Analysis",
      description: "Identify fabric types, textures, and materials using AI-powered image recognition technology.",
      link: "/analysis/textile",
      image: "https://study.com/cimages/videopreview/videopreview-full/bjbhw2dvj5.jpg",
    },
    {
      title: "Pattern Analysis",
      description: "Detect and classify patterns, prints, and design elements in fashion items and textiles.",
      link: "/analysis/pattern",
      image:
        "https://media.springernature.com/lw685/springer-static/image/art%3A10.1186%2Fs40691-016-0061-1/MediaObjects/40691_2016_61_Fig4_HTML.gif",
    },
    {
      title: "All in One",
      description:
        "Comprehensive analysis combining garment, color, textile, and pattern recognition in a single service.",
      link: "/analysis/all-in-one",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-J6K8otUuGaVmPcThz2yYDfl81-IfW2v3Q&s",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-playfair text-4xl md:text-5xl text-center">Fashion Analysis</h1>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Explore our AI-powered fashion analysis tools to gain insights into garments, colors, textiles, and
            patterns.
          </p>
        </div>
      </section>

      {/* Analysis Options */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {analysisOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src={option.image || "/placeholder.svg"} alt={option.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <Link href={option.link}>
                  <Button>Try It</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

