interface SkinTypeStepProps {
  value: string
  onChange: (type: string) => void
  onNext: () => void
}

const SKIN_TYPES = [
  { id: 'oily',        label: 'Oily',        desc: 'Shiny, enlarged pores',       icon: '💧' },
  { id: 'dry',         label: 'Dry',          desc: 'Tight, flaky, dull',          icon: '🏜️' },
  { id: 'combination', label: 'Combination',  desc: 'Oily T-zone, dry cheeks',     icon: '☯️' },
  { id: 'sensitive',   label: 'Sensitive',    desc: 'Reacts easily, redness',      icon: '🌸' },
  { id: 'normal',      label: 'Normal',       desc: 'Balanced, few issues',        icon: '✨' },
  { id: 'acne-prone',  label: 'Acne-prone',   desc: 'Frequent breakouts',          icon: '🔴' },
]

export default function SkinTypeStep({ value, onChange, onNext }: SkinTypeStepProps) {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest text-sage-600 mb-1.5">Step 1 of 4</p>
        <h2 className="font-serif text-2xl font-medium text-gray-900">What&apos;s your skin type?</h2>
        <p className="text-gray-500 mt-1.5 text-sm">Select the one that describes your skin most of the time.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {SKIN_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`p-4 rounded-2xl border text-left transition-all duration-150 ${
              value === type.id
                ? 'bg-sage-50 border-sage-500'
                : 'bg-white border-gray-200 hover:border-sage-300'
            }`}
          >
            <span className="text-2xl block mb-2">{type.icon}</span>
            <span className="text-sm font-medium text-gray-900 block">{type.label}</span>
            <span className="text-xs text-gray-400 mt-0.5 block">{type.desc}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={onNext} disabled={!value}>
        Continue
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
