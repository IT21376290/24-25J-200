'user server'

import { signUpSchema } from "@/app/lib/schemas";
import { parseWithZod } from "@conform-to/zod";
import axios from "axios";
import Swal from 'sweetalert2'
import { redirect } from 'next/navigation'

export const registerUser = async (
    prevState: unknown,
    formData: FormData
) => {
    const submission = parseWithZod(formData, {
        schema: signUpSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    axios
        .post(
            "http://localhost:5000/api/v1/register",
            {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            })
        .then((response) => {
            if (response.status === 201) {
                Swal.fire({
                    title: "Success!",
                    text: "Successfully Registered",
                    icon: "success"
                });

                localStorage.setItem('UserData', JSON.stringify(response.data))

                setTimeout(() => {
                    redirect('/account/profile-creation');
                }, 1000)
            }

        })
        .catch((error) => {
            const { response } = error;
            if (response.status === 400) {
                Swal.fire({
                    title: "Already Registered",
                    text: "An account with this email or username already registered",
                    icon: "error"
                });
            }
        });
};