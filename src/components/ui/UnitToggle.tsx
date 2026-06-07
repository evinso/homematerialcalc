interface Props {
  metric: boolean;
  onToggle: (metric: boolean) => void;
  className?: string;
}

export default function UnitToggle({ metric, onToggle, className = '' }: Props) {
  return (
    <div className={`inline-flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-medium ${className}`}>
      <button
        onClick={() => onToggle(false)}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          !metric ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        ft / in
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-2.5 py-1 rounded-md transition-colors ${
          metric ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        m / cm
      </button>
    </div>
  );
}

// Conversion helpers
export const ftToM  = (ft: number) => ft * 0.3048;
export const mToFt  = (m: number)  => m / 0.3048;
export const inToCm = (i: number)  => i * 2.54;
export const cmToIn = (cm: number) => cm / 2.54;
