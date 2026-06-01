import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useLoginUserMutation } from "@/services/authApi";
import { getDashboardPathByPermissions } from "@/utils/dashboard";
import { ROLES } from "@/constants/roles";
import { getPermissionsFromRoles } from "@/constants/rolePermissions";
import type { Role } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = { email: string; password: string };

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const saveAuthAndRedirect = (payload) => {
    dispatch(loginSuccess(payload));
    toast.success("Login successful");
    navigate(getDashboardPathByPermissions(payload.user.permissions));
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginUser({ email: values.email, password: values.password }).unwrap();
      saveAuthAndRedirect(response);
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  const loginAsDemo = (roles: Role[]) => {
    const permissions = getPermissionsFromRoles(roles);
    saveAuthAndRedirect({
      token: "demo-access-token",
      refreshToken: "demo-refresh-token",
      user: {
        id: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        roles,
        permissions,
        avatarUrl: "",
      },
    });
  };

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" boxShadow="xl" p={{ base: 6, md: 8 }}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Login</Heading>
          <Text color="gray.600" mt={2}>Use the real API form or demo buttons for testing permissions.</Text>
        </Box>

        <VStack as="form" onSubmit={handleSubmit(onSubmit)} align="stretch" spacing={4}>
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
          <Button type="submit" isLoading={isLoading} loadingText="Logging in...">Login</Button>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.ADMIN])}>Admin</Button>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.PENTESTER])}>Pentester</Button>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.DEVOPS])}>DevOps</Button>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.REPRESENTATIVE])}>Representative</Button>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.QA])}>QA</Button>
          <Button variant="secondary" onClick={() => loginAsDemo([ROLES.PENTESTER, ROLES.QA])}>Pentester + QA</Button>
          <Button variant="secondary" onClick={() => loginAsDemo(Object.values(ROLES) as Role[])}>All Roles</Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
