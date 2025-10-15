import { InferType, object, string } from 'yup';

export const contactSchema = object({
  name: string().default('').required('Name is required'),
  email: string()
    .default('')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email')
    .required('Email is required')
    .default(''),
  message: string().default('').required('Message is required'),
});

export type ContactType = InferType<typeof contactSchema>;
