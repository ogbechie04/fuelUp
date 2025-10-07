import z from 'zod';

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .nonempty({ message: 'Phone Number is required' })
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isDeliveryDriver: z.boolean().default(false),
});

export type LoginData = z.infer<typeof loginSchema>;
