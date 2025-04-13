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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpAYIhUH334gAAjg8jg5g85xACl4v2_IqXlQ&s",
    },
    {
      title: "Color Analysis",
      description: "Extract and analyze color palettes, trends, and combinations from fashion items and collections.",
      link: "/analysis/color",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-4LOsVwbknRwSgYVzKSvjJA_EuwPPgJUYvxmuuwqycvpJ5EgpCNBawgJphInRIaWmQI4&usqp=CAU",
    },
    {
      title: "Textile Analysis",
      description: "Identify fabric types, textures, and materials using AI-powered image recognition technology.",
      link: "/analysis/textile",
      image: "https://www.theenvironment.in/wp-content/uploads/2023/07/CLOTHING.jpg",
    },
    {
      title: "Pattern Analysis",
      description: "Detect and classify patterns, prints, and design elements in fashion items and textiles.",
      link: "/analysis/pattern",
      image:
        "https://c2fashionstudio.com/wp-content/uploads/2024/01/Fashion-Trend-Spring-Summer-2025-Moodboard_Sunset-Coral-1086x1536.jpg",
    },
    {
      title: "All in One",
      description:
        "Comprehensive analysis combining garment, color, textile, and pattern recognition in a single service.",
      link: "/analysis/all-in-one",
      image: "https://img.freepik.com/premium-photo/aidriven-fashion-design-future-vision_762785-4733.jpg",
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

