import AIShowcase from "./components/AIShowcase";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import LogoCloud from "./components/LogoCloud";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <AIShowcase />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
