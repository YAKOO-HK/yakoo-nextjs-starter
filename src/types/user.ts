import { z } from 'zod';

export const USER_STATUS_ACTIVE = 10;
export const USER_STATUS_INACTIVE = 0;

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: 'Required.' }),
  password: z.string().min(1, { message: 'Required.' }),
  type: z.enum(['frontend', 'admin']),
});
export type UserLoginFormData = z.infer<typeof UserLoginSchema>;

export const RequestPasswordResetSchema = z.object({
  email: z.string().email(),
  hCaptcha: z.string({ required_error: 'Please complete the captcha' }).min(1, {
    message: 'Please complete the captcha',
  }),
});
export type RequestPasswordResetFormData = z.infer<typeof RequestPasswordResetSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Must be at least 8 characters',
    }),
    passwordConfirmation: z.string().min(8, {
      message: 'Must be at least 8 characters',
    }),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required').min(8),
    password: z.string().min(1, 'Required').min(8),
    passwordConfirmation: z.string().min(1, 'Required').min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
