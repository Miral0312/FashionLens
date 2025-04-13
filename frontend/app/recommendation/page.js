import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function RecommendationPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-playfair text-4xl md:text-5xl text-center">Fashion Recommendation</h1>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            This page is under construction. Our AI-powered fashion recommendation system will be available soon.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-playfair mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            We're building a personalized recommendation system that will suggest fashion items based on your
            preferences, style, and current trends. Check back later for updates.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

