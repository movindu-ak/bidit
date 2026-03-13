interface ConditionSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Label for the low end of the scale */
  min: string;
  /** Label for the mid point of the scale */
  mid: string;
  /** Label for the high end of the scale */
  max: string;
  /** CSS colour for the filled track */
  color: string;
}

/** Range slider with a coloured gradient track and descriptive end-labels */
export function ConditionSlider({
  label,
  value,
  onChange,
  min,
  mid,
  max,
  color,
}: ConditionSliderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="text-sm font-bold text-gray-800">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${value}%, #e5e7eb ${value}%)`,
          accentColor: color,
        }}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{mid}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
