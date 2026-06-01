import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Box, FormControl, FormErrorMessage, FormLabel, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useRegisterUserMutation } from "@/services/authApi";
import { useUploadFileMutation } from "@/services/uploadApi";
import { getDashboardPathByPermissions } from "@/utils/dashboard";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  avatar: z
    .any()
    .refine((files) => files?.length === 1, "Avatar image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max image size is 2MB")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only JPG, PNG, or WEBP images are allowed"),
});

type SignupFormValues = { name: string; email: string; password: string; roles: string[]; avatar: any };

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", roles: [] },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const avatarFile = values.avatar[0];
      const uploadResponse = await uploadFile({ file: avatarFile, folder: "avatars" }).unwrap();

      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        roles: values.roles,
        avatarUrl: uploadResponse.url,
        avatarFileId: uploadResponse.fileId,
      }).unwrap();

      dispatch(loginSuccess(response));
      toast.success("Account created successfully");
      navigate(getDashboardPathByPermissions(response.user.permissions));
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed");
    }
  };

  const isLoading = isUploading || isRegistering;

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="xl" p={{ base: 6, md: 8 }}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Create Account</Heading>
          <Text color="gray.600" mt={2}>Signup uploads avatar first, then sends user data to the register API.</Text>
        </Box>

        <VStack as="form" onSubmit={handleSubmit(onSubmit)} align="stretch" spacing={4}>
          <Input label="Name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

          <FormControl isInvalid={Boolean(errors.roles)}>
            <FormLabel>Roles</FormLabel>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              {Object.values(ROLES).map((role) => (
                <Box
                  as="label"
                  key={role}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  p={3}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                >
                  <input type="checkbox" value={role} {...register("roles")} />
                  <Text fontWeight="600">{ROLE_LABELS[role]}</Text>
                </Box>
              ))}
            </SimpleGrid>
            {errors.roles && <FormErrorMessage>{errors.roles.message}</FormErrorMessage>}
          </FormControl>

          <Input label="Avatar Image" type="file" accept="image/png,image/jpeg,image/webp" {...register("avatar")} error={errors.avatar?.message as string | undefined} />

          <Button type="submit" isLoading={isLoading} loadingText="Creating account...">Signup</Button>
        </VStack>
      </VStack>
    </Box>
  );
}
