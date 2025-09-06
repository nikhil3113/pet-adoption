import { Controller, FieldValues, Control, Path } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>; // Changed from keyof T to Path<T>
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  autocomplete?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

const FormFields = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  description,
  autocomplete = "on",
  disabled = false,
  options = [],
}: FormFieldProps<T>) => {
  return (
    <FormItem>
      <FormLabel className="text-[15px]">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  aria-invalid={!!fieldState.error}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={5}
                  disabled={disabled}
                />
              ) : type === "select" ? (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(val) => field.onChange(!!val)}
                    disabled={disabled}
                  />
                  <span className="text-sm">{placeholder}</span>
                </div>
              ) : (
                <Input
                  {...field}
                  className="dark:border-gray-600"
                  placeholder={placeholder}
                  type={type}
                  aria-invalid={!!fieldState.error}
                  onChange={(e) =>
                    type === "number"
                      ? field.onChange(parseInt(e.target.value))
                      : field.onChange(e.target.value)
                  }
                  autoComplete={autocomplete}
                />
              )}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  );
};

export default FormFields;
