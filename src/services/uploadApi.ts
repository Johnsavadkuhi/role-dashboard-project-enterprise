import { api } from "@/services/api";
import type { UploadResponse } from "@/types";

type UploadPayload = { file: File; fieldName?: string; folder?: string };

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, UploadPayload>({
      query: ({ file, fieldName = "file", folder = "avatars" }) => {
        const formData = new FormData();
        formData.append(fieldName, file);
        formData.append("folder", folder);

        return { url: "/uploads", method: "POST", body: formData };
      },
      invalidatesTags: ["Upload"],
    }),
    deleteFile: builder.mutation<{ success: boolean }, string>({
      query: (fileId) => ({ url: `/uploads/${fileId}`, method: "DELETE" }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const { useUploadFileMutation, useDeleteFileMutation } = uploadApi;
