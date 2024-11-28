"use client";

import { Checkbox, Label } from "flowbite-react";
import Link from "next/link";
import React, { useActionState } from "react";
import { logInUser } from "./action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/lib/schemas";

function SignIn() {
  const [lastResult, action] = useActionState(logInUser, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="h-full flex items-center">
      <div className="max-w-md mx-auto w-full px-10 py-6 rounded-[10px] bg-white">
        <h1 className="text-[23px] sm:text-[31px] font-[600] text-center">
          Log in to your account
        </h1>

        <p className="text-center text-[16px] font-[700] text-[#5D5D5D] mt-1">
          Welcome back! Please enter your details
        </p>

        <form
          className="space-y-5 mt-12"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
        >
          <div>
            <label
              htmlFor="email"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email *
            </label>
            <input
              type="text"
              id="email"
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your email "
            />
            <div
              className="ps-2 text-sm text-red-800 rounded-lg dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {fields.email.errors}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password *
            </label>
            <input
              type="password"
              id="password"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Create password"
            />
            <div
              className="ps-2 text-sm text-red-800 rounded-lg dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {fields.password.errors}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember for 30 days</Label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-2/3 text-white bg-[#1366D9] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[8px] text-[16px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Log in
            </button>
          </div>
        </form>

        <div className="text-center mt-5">
          Dont have an account ?
          <Link
            href="/account/sign-up"
            className="ps-3 text-[#1366D9] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
