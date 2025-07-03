import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="flex items-center h-10 border rounded-lg w-full">
      <SearchIcon className="w-4 h-4 ml-2 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 px-2 py-1 text-sm text-gray-700 bg-transparent focus:outline-none"
      />
    </div>
  );
}
