import Hero from './sections/Hero'
import Problema from './sections/Problema'
import Solucion from './sections/Solucion'
import Formulario from './sections/Formulario'
import FAQSection from './sections/FAQSection'
import Footer from './sections/Footer'
import { useSubscriberCount } from './hooks/useSubscriberCount'

export default function App() {
  const [remaining, setRemaining] = useSubscriberCount()

  return (
    <div className="font-body antialiased bg-paper text-ink overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.022] bg-grain" />
      <Hero remaining={remaining} />
      <Problema />
      <Solucion />
      <Formulario remaining={remaining} onSubscribed={setRemaining} />
      <FAQSection />
      <Footer />
    </div>
  )
}
