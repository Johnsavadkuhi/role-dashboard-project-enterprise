import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useLoginUserMutation } from "@/services/authApi";
import { getDashboardPathByPermissions } from "@/utils/dashboard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = { username: string; password: string };

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const saveAuthAndRedirect = (payload) => {
    dispatch(loginSuccess(payload));
    toast.success("Login successful");
    navigate(getDashboardPathByPermissions(payload.user.permissions));
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginUser({
        username: values.username,
        password: values.password,
      }).unwrap();
      saveAuthAndRedirect(response);
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="xl"
      p={{ base: 6, md: 8 }}
    >
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="lg">Login</Heading>
          <Text color="gray.600" mt={2}>
            Sign in with your username and password.
          </Text>
        </Box>

        <VStack as="form" onSubmit={handleSubmit(onSubmit)} align="stretch" gap={4}>
          <Input
            label="Username"
            autoComplete="username"
            {...register("username")}
            error={errors.username?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button type="submit" isLoading={isLoading} loadingText="Logging in...">
            Login
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
