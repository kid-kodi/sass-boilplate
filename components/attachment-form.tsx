"use client";

import { File, PlusCircle, Trash } from "lucide-react";
import React from "react";
import { z } from "zod";
import { UpdateCourse, UploadCourseFile } from "../../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { CourseSchema } from "@/lib/schemas";

interface AttachmentFormProps {
  initialData: {
    attachments: [string];
  };
  courseId: string;
}

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof CourseSchema>) => {
    try {
      const response = await UpdateCourse(courseId, values);
      if (response.success) {
        toast.success("Mise a jour effectuee");
        router.refresh();
      } else {
        toast.error("Oopse une erreur est intervenue");
      }
    } catch {
      toast.error("Oopse une erreur est intervenue");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formData = new FormData();
    if (event.target.files) formData.append("file", event.target.files[0]);
    const response = await UploadCourseFile(formData);
    if (response.success) {
      initialData.attachments.push(response.data.name);
      await onSubmit(initialData);
    } else {
      toast.error("Une erreur s'est produite");
    }
  };

  const onDelete = async (attachment: string) => {
    const index = initialData.attachments.indexOf(attachment);
    if (index !== -1) {
      initialData.attachments.splice(index, 1);
      await onSubmit(initialData);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Liste des ressources de la formation
        <label htmlFor="file">
          <div className="flex items-center gap-x-2">
            <PlusCircle className="w-4 h-4 mr-2" />
            Ajouter
          </div>
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file"
            name="file"
          />
        </label>
      </div>
      <div className="space-y-4 mt-4">
        {initialData.attachments.length > 0 ? (
          <>
            {initialData.attachments.map((attachment, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment}</p>
                  <button
                    onClick={() => onDelete(attachment)}
                    className="ml-auto hover:opacity-75 transition"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          <p className="text-sm mt-2 text-slate-500 italic">
            Aucunes ressources trouvees
          </p>
        )}
      </div>
    </div>
  );
}
