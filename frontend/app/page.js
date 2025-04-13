import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="https://www.lefashionpost.com/wp-content/uploads/2024/12/futuristic-fashion-tech-trends.jpeg"
          alt="AI Fashion Hero"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-playfair text-5xl md:text-7xl">AI-Powered Fashion</h1>
          <p className="mt-4 text-lg md:text-xl">
            Empower Your Fashion Decisions with Data-Driven Insights and AI Creativity
          </p>
          <Button className="mt-8 bg-white text-black hover:bg-gray-100">Try it now</Button>
        </div>
      </section>

      {/* Fashion Trend Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-playfair text-3xl">
          FASHION TREND <span className="italic text-gray-500">forecasting</span>
        </h2>
        <p className="mt-4 max-w-2xl text-gray-600">
          Welcome to the next wave of fashion intelligence, where AI-driven insights elegantly blend with your creative
          spirit.
        </p>
        <Link href="/prediction">
          <Button variant="outline" className="mt-4">
            Read More →
          </Button>
        </Link>
      </section>

      {/* Upcoming Trends Grid */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-playfair text-2xl uppercase">ANALYSIS</h3>
          <p className="text-gray-600">
            Welcome to our fashion analysis section, where we delve into the latest trends and styles. Our team of
            experts analyzes various aspects of the fashion industry, including:
            <br />
            <br />• Trending Colors
            <br />• Popular Fabrics
            <br />• Last but not the least Garments
          </p>
          <Link href="/analysis">
            <Button variant="outline">Read More →</Button>
          </Link>
        </div>
        <div className="relative h-[400px]">
          <Image
            src="https://assets.vogue.com/photos/642c76fb07f0a84b0a7c0326/master/w_2560%2Cc_limit/00-story-2%2520(3).jpg"
            alt="Upcoming Trends"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Design Direction */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2">
        <div className="relative h-[500px]">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpAYIhUH334gAAjg8jg5g85xACl4v2_IqXlQ&s"
            alt="Design Direction"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-playfair text-2xl uppercase">PREDICTION</h3>
          <p className="text-gray-600">
            Unlock the secrets of fashion prediction as we delve into the anticipated trends and styles shaping the
            industry. Our predictive analysis covers a wide range of aspects, including:
            <br />
            <br />• Next-Gen Materials and Textiles
            <br />• Cutting-Edge Design Concepts
            <br />• Global Fashion Influences
          </p>
          <Link href="/prediction">
            <Button variant="outline">Read More →</Button>
          </Link>
        </div>
      </section>

      {/* Virtual Try-On Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-playfair text-2xl uppercase">VIRTUAL TRY-ON</h3>
          <p className="text-gray-600">
            Experience the future of fashion with our AI-powered Virtual Try-On, transforming how you shop and style.
            Our innovative technology offers:
            <br />
            <br />• Realistic Fit & Draping
            <br />• Instant Outfit Swaps
            <br />• Personalized Recommendations
            <br />• Smarter Shopping with Reduced Returns
            <br />
            <br />
            Step into a seamless, interactive fashion experience designed for shoppers, designers, and retailers.
            Discover the perfect look with confidence!
          </p>
          <Link href="/virtual-try-on">
            <Button variant="outline">Read More →</Button>
          </Link>
        </div>
        <div className="relative h-[500px]">
          <Image
            src="https://www.theenvironment.in/wp-content/uploads/2023/07/CLOTHING.jpg"
            alt="Virtual Try-On"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Recommendation System Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2">
        <div className="relative h-[500px]">
          <Image
            src="https://lh3.googleusercontent.com/R6B6ECr1LnxoBqJkwYxK5pDOmiEe0Ae51mIhyPpP5xYSZKCpb-OBvhf2JKqQwhKuEM8yLqvFaQY-pjcrXev6cskFojsydHPIJxfMGfjXQbwVX0Q1txdaRBFcHPm90fwdsgBqj3qP"
            alt="Recommendation System"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-playfair text-2xl uppercase">RECOMMENDATION SYSTEM</h3>
          <p className="text-gray-600">
            Enhance your fashion journey with our AI-powered Recommendation System, designed to match your style
            effortlessly. By analyzing trends, preferences, and data insights, we offer:
            <br />
            <br />• Personalized Outfit Suggestions
            <br />• Trend-Based Recommendations
            <br />• Style & Color Matching
            <br />• Data-Driven Insights
            <br />
            <br />
            Discover fashion that truly fits you and stay ahead of the trends with ease!
          </p>
          <Link href="/recommendation">
            <Button variant="outline">Read More →</Button>
          </Link>
        </div>
      </section>

      {/* AI Analytics Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="font-playfair text-2xl uppercase">MORE ABOUT OUR PROJECT</h3>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="text-gray-600">
              Overproduction, waste, and fast changing consumer preferences are the major problems of the apparel sector
              due to swift expansion of social media and fast fashion. The present research develops an AI-based
              framework using the integration of YOLOv9 and ResNet50 architectures in order to tackle essential aspects
              of the fashion domain like garment classification, color segmentation, pattern detection, and textile
              identification. A trend analysis module, using Google Trends data and NeuralProphet, shows market
              preference over the past five years and predicts demand for the next year, which gives practical insights
              to manage inventory and plan production. The framework also implements a personalized recommendation
              system tailored to recommend visually and stylistically similar items created from uploaded images, which
              increases user involvement, and an implementation of virtual try-on via IDM VTON API GANs, to be intended
              for reducing return rates and improving e-commerce decision-making capabilities. With scalability, it can
              be trained on diverse datasets from varied classes to bridge predictive analytics, inclusivity, and
              consumer interactivity, thus making sustainable practices in production aligned with market demand toward
              a more efficient and eco-friendly future for fashion.
            </p>
            <div className="relative h-[300px]">
              <Image
                src="https://img.freepik.com/premium-photo/aidriven-fashion-design-future-vision_762785-4733.jpg"
                alt="AI Analytics"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trend Slider */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="font-playfair text-2xl">
                FOLLOW THE <span className="italic text-gray-400">trends</span>
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="relative h-[400px]">
                <Image
                  src="https://c2fashionstudio.com/wp-content/uploads/2024/01/Fashion-Trend-Spring-Summer-2025-Moodboard_Sunset-Coral-1086x1536.jpg"
                  alt="Trend 1"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="relative h-[400px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-4LOsVwbknRwSgYVzKSvjJA_EuwPPgJUYvxmuuwqycvpJ5EgpCNBawgJphInRIaWmQI4&usqp=CAU"
                  alt="Trend 2"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative h-[400px]">
        <Image
          src="https://www.shutterstock.com/image-photo/sydney-australia-may-19-empty-600nw-577849537.jpg"
          alt="Final CTA"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="font-playfair text-4xl">
            FASHION Lens <br />
            WILL GUIDE YOU <br />
            <span className="italic">plan right.</span>
          </h2>
          <Button className="mt-8 bg-white text-black hover:bg-gray-100">Get Started</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

