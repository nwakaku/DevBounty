import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="w-full md:w-1/2">
      <Input type="text" placeholder="Search..." className="max-w-xl" />
    </div>
  );
}
