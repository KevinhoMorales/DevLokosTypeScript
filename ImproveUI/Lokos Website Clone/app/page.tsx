import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { EpisodeList } from "@/components/episode-list"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      <Navbar />
      <Hero />
      <EpisodeList />
      <Footer />
    </main>
  )
}
