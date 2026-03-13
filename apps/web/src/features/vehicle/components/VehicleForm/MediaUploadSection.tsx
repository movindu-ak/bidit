import { Plus, X } from "lucide-react";

interface MediaUploadSectionProps {
  previews: string[];
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

/** Photo upload grid — accepts up to 6 images */
export function MediaUploadSection({
  previews,
  onSelect,
  onRemove,
}: MediaUploadSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-200">
      <h3 className="font-bold text-gray-900 text-base">
        Photos{" "}
        <span className="text-xs text-gray-400 font-normal">(max 6 images)</span>
      </h3>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onSelect}
      />

      <div className="grid grid-cols-3 gap-4">
        {previews.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={url}
              alt={`Vehicle ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {previews.length < 6 && (
          <label
            htmlFor="image-upload"
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00a8e8] hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500 text-center px-2">
              Click to upload
            </span>
          </label>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Accepted: JPG, PNG, WEBP — up to 6 photos
      </p>
    </div>
  );
}
