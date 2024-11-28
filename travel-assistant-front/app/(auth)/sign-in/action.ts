'user server'

import { signInSchema } from "@/app/lib/schemas";
import { parseWithZod } from "@conform-to/zod";
import axios from "axios";
import Swal from "sweetalert2";
import { redirect } from 'next/navigation'


export const logInUser = async (
    prevState: unknown,
    formData: FormData
) => {

    const submission = parseWithZod(formData, {
        schema: signInSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    axios
        .post(
            "http://localhost:5000/api/v1/login",
            {
                email: formData.get('email'),
                password: formData.get('password')
            })
        .then((response) => {

            if (response.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Successfully logged in.",
                    icon: "success"
                });
            }
            localStorage.setItem('UserData', JSON.stringify(response.data))

            setTimeout(() => {
                redirect('/');
            }, 1000)
        })
        .catch((error) => {

            const { response } = error;

            if (response.status === 401) {
                Swal.fire({
                    title: "Error!",
                    text: "Invalid Email or Password",
                    icon: "error"
                });
            }
        });
};