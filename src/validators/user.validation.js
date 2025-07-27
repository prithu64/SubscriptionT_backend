import {z} from "zod";

const signupValidationSchema = z.object({
    username: z.string().min(4,"username must be at least 4 character"),
    email : z.string().email(),
    password : z.string().min(6,"password must be atleast 6 characters")
})

const signinValidationSchema = z.object({
    username : z.string().min(4),
    password  : z.string().min(6)
})

const updateValidationSchema = z.object({
    username: z.string().min(4,"username must be at least 4 character").optional(),
    email : z.string().email().optional(),
    password : z.string().min(6,"password must be atleast 6 characters").optional()
})

export {signupValidationSchema,signinValidationSchema,updateValidationSchema}