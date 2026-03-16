/** Generic icon-tile button group for single-select categorical fields */
export function TileGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; icon: string; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-700 font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex flex-col items-center justify-center gap-1 w-24 h-20 rounded-xl border-2 text-xs font-semibold transition-all
              ${
                value === o.value
                  ? "border-[#00a8e8] bg-blue-50 text-[#00a8e8]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
          >
            <span className="text-2xl">{o.icon}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
