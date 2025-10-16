"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Pencil } from "lucide-react";
import React, { useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface DynamicFormProps {
  initialData: string;
  id: string;
  fieldName: string;
  updateFunction: (id: string, fieldName: string, value: string) => Promise<{ success: boolean }>;
  label?: string;
  placeholder?: string;
  validationSchema?: z.ZodSchema;
  successMessage?: string;
  errorMessage?: string;
  inputType?: "text" | "textarea" | "email" | "number" | "date" | "select" | "tel";
  options?: { title: string; value: string; }[];
  className?: string;
}

export default function DynamicForm({
  initialData,
  id,
  fieldName,
  updateFunction,
  label = "Field",
  placeholder,
  successMessage = "Mise a jour effectuee",
  errorMessage = "Oopse une erreur est intervenue",
  inputType = "text",
  options,
  className = "mt-1 border-b py-2",
}: DynamicFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  // Create a simple form schema with explicit typing
  const formSchema = z.object({
    value: z.string().min(1, "Ce champ est requis"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialData || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await updateFunction(id, fieldName, values.value);

      if (response?.success) {
        toast.success(successMessage);
        toggleEdit();
        router.refresh();
      } else {
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log(error);
      toast.error(errorMessage);
    }
  };

  const renderInput = (field: ControllerRenderProps<{
    value: string;
  }, "value">) => {
    const inputProps = {
      disabled: isSubmitting,
      placeholder,
      ...field,
    };

    switch (inputType) {
      case "textarea":
        return (
          <textarea
            {...inputProps}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
          />
        );
      case "number":
        return <FormControl><Input type="number" {...inputProps} /></FormControl>;
      case "tel":
        return <FormControl><Input type="tel" {...inputProps} /></FormControl>;
      case "email":
        return <FormControl><Input type="email" {...inputProps} /></FormControl>;
      case "select":
        return <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {
              options &&
              options.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.title}</SelectItem>
              ))}
          </SelectContent>
        </Select>;
      case "date":
        return <>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </>;
      default:
        return <FormControl><Input {...inputProps} /></FormControl>;
    }
  };

  const displayValue = initialData !== undefined && initialData !== null
    ? inputType === "select"
      ? options?.find(opt => opt.value === initialData)?.title || "Non défini"
      : String(initialData)
    : "Non défini";

  return (
    <div className={className}>
      <div className="font-medium flex items-center justify-between">
        {label}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {!isEditing ? (
            <>
              <Pencil className="w-4 h-4" />
            </>
          ) : (
            <>Annuler</>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2">{displayValue}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  {renderInput(field)}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}