import Hero from './sections/Hero'
import Problema from './sections/Problema'
import Solucion from './sections/Solucion'
import Formulario from './sections/Formulario'
import FAQSection from './sections/FAQSection'
import Footer from './sections/Footer'

export default function App() {
  return (
    <div className="font-body antialiased bg-paper text-ink overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.022] bg-grain" />
      <Hero />
      <Problema />
      <Solucion />
      <Formulario />
      <FAQSection />
      <Footer />
    </div>
  )
}
