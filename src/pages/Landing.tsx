import { Header } from "../components/landing/Header"
import { Hero } from "../components/landing/Hero"

export default function Landing() {
  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main>
        <Hero />
        {/* Stats-bar (6005:3668) is empty in the Figma frame so far */}
      </main>
    </div>
  )
}
