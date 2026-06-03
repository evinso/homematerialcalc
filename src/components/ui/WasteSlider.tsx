interface Props {
  value: number; // 0–0.30
  onChange: (v: number) => void;
}

export default function WasteSlider({ value, onChange }: Props) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">Waste / overage factor</label>
        <span className="text-sm font-semibold text-brand-700">{pct}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="30"
        step="5"
        value={pct}
        onChange={e => onChange(Number(e.target.value) / 100)}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>0%</span><span>10%</span><span>20%</span><span>30%</span>
      </div>
    </div>
  );
}
