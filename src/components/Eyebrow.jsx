export default function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`font-body text-[10px] font-semibold tracking-[0.34em] uppercase inline-flex items-center gap-3 ${
        light ? 'text-electric-light' : 'text-electric'
      }`}
    >
      <span
        className={`w-[7px] h-[7px] rounded-full flex-none ${
          light ? 'bg-electric-light' : 'bg-electric'
        }`}
      />
      {children}
    </span>
  )
}
