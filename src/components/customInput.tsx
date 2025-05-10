import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

interface Props {
  name: string;
  type: HTMLInputElement["type"];
  placeholder?: string;
  errors?: string[];
}

export default function CustomInput({
  name,
  type,
  placeholder,
  errors,
}: Props) {
  const [value, setValue] = useState<string>("");

  return (
    <div className="space-y-2">
      <Label htmlFor={type} className="capitalize">
        {name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder || "name@example.com"}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary py-5" 
      />

      {errors &&
        errors.map((error, index) => (
          <span key={index} className="text-red-500 text-sm">
            {error}
          </span>
        ))}
    </div>
  );
}
