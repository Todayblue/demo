"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { CreateUserPayload, CreateUserValidator } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<CreateUserPayload>({
    resolver: zodResolver(CreateUserValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createUser = async (payload: CreateUserPayload) => {
    const { data } = await axios.post("/api/user", payload);
    return data;
  };

  const { mutate: userCreate, isPending } = useMutation({
    mutationFn: async (values: CreateUserPayload) => createUser(values),
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          if (err.response.data.message.includes("email")) {
            return toast.error("User with this email already exists");
          } else if (err.response.data.message.includes("username")) {
            return toast.error("User with this username already exists");
          }
        }
      }
      toast.error("Could not create user");
    },
    onSuccess: (data) => {
      toast.success("Create user successfully");
      setTimeout(() => {
        router.push("/user/sign-in");
      }, 1000);
    },
  });

  const onSubmit = (payload: CreateUserPayload) => {
    userCreate(payload);
  };
  return (
    <Form {...form}>
      <Toaster position="top-right" reverseOrder={false} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <CardHeader className="text-center  space-y-1 px-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Re-Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" isLoading={isPending} type="submit">
          Sign up
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/user/sign-in">
          Sign in
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
