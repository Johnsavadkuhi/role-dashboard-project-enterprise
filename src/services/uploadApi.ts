import { api } from "@/services/api";
import type { UploadResponse } from "@/types";

type UploadPayload = { file: File; fieldName?: string };

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, UploadPayload>({
      query: ({ file, fieldName = "avatar" }) => {
        const formData = new FormData();
        formData.append(fieldName, file);

        return { url: "/upload/avatar", method: "POST", body: formData };
      },
      invalidatesTags: ["Upload"],
    }),
    deleteFile: builder.mutation<{ success: boolean }, string>({
      query: (fileId) => ({ url: `/upload/${fileId}`, method: "DELETE" }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const { useUploadFileMutation, useDeleteFileMutation } = uploadApi;
