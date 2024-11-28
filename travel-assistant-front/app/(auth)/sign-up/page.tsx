"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { registerUser } from "./actions";
import { signUpSchema } from "@/app/lib/schemas";

function SignUp() {
  const [lastResult, action] = useActionState(registerUser, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  
  return (
    <div className="h-full flex items-center">
      <form
        className="max-w-md w-full mx-auto px-10 py-10 rounded-[10px] bg-white"
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
      >
        <h1 className="text-[25px] sm:text-[31px] font-[600] text-center mb-12">
          Create an account
        </h1>

        <div className="mb-5">
          <label
            htmlFor="username"
            className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username *
          </label>
          <input
            type="text"
            id="username"
            key={fields.username.key}
            name={fields.username.name}
            defaultValue={fields.username.initialValue}
            className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter your username"
          />
          <div
            className="ps-2 text-sm text-red-800 rounded-lg dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {fields.username.errors}
          </div>
        </div>

        <div className="mb-5">
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

        <div className="mb-5">
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

        <div className="mb-5">
          <label
            htmlFor="repeat-password"
            className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm password *
          </label>
          <input
            type="password"
            id="repeat-password"
            key={fields.confirmPassword.key}
            name={fields.confirmPassword.name}
            defaultValue={fields.confirmPassword.initialValue}
            className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Confirm new password"
          />
          <div
            className="ps-2 text-sm text-red-800 rounded-lg dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {fields.confirmPassword.errors}
          </div>
        </div>

        <div className="flex justify-center mt-11 mb-6">
          <button
            type="submit"
            className="w-2/3 text-white bg-[#1366D9] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[8px] text-[16px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get started
          </button>
        </div>

        <div className="text-center mt-5">
          Already have an account ?
          <Link
            href="/account/sign-in"
            className="ps-3 text-sm sm:text-base text-[#1366D9] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
