import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Specialties from "@/components/sections/specialties";
import Technologies from "@/components/sections/technologies";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Stats from "@/components/sections/stats";
import Education from "@/components/sections/education";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Specialties />
        <Technologies />
        <Experience />
        <Projects />
        <Stats />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
