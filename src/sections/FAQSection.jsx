import Eyebrow from '../components/Eyebrow'
import FAQItem from '../components/FAQItem'
import { faqs } from '../data/faqs'

export default function FAQSection() {
  return (
    <section className="bg-cream py-14 md:py-[88px]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-10">
        <Eyebrow>Dudas</Eyebrow>
        <h2 className="font-display font-bold text-[clamp(26px,3.2vw,40px)] tracking-[-0.015em] text-ink mt-[22px] mb-11">
          Preguntas frecuentes
        </h2>
        <div className="border-t border-dust">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
