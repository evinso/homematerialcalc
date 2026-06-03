interface Props {
  label: string;
  feet: number;
  inches: number;
  onFeetChange: (v: number) => void;
  onInchesChange: (v: number) => void;
}

export default function FtInInput({ label, feet, inches, onFeetChange, onInchesChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            min="0"
            step="1"
            value={feet}
            onChange={e => onFeetChange(Math.max(0, Number(e.target.value)))}
            className="input-field"
            placeholder="0"
          />
          <span className="text-xs text-gray-500 mt-0.5 block">feet</span>
        </div>
        <div className="w-24">
          <input
            type="number"
            min="0"
            max="11"
            step="1"
            value={inches}
            onChange={e => onInchesChange(Math.min(11, Math.max(0, Number(e.target.value))))}
            className="input-field"
            placeholder="0"
          />
          <span className="text-xs text-gray-500 mt-0.5 block">inches</span>
        </div>
      </div>
    </div>
  );
}
