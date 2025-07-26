import { z } from "zod";

const makeSubsSchema = z.object({
    subs_name : z.string().min(4),
    payment_date :z.coerce.date(),
    payment_plan:z.string(),
    payment_amount :z.number()
})

const updateSubsSchema = z.object({
    subs_name : z.string().min(4).optional(),
    payment_date :z.coerce.date().optional(),
    payment_plan : z.string().optional(),
    payment_amount :z.number().optional()
})

export {makeSubsSchema,updateSubsSchema}