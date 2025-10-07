import { LoginData } from '@/features/auth/loginSchema';
import { SignUpData } from '@/features/auth/signUpSchema';

export const transformSignUpData = (data: SignUpData) => {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone_number: data.phoneNumber,
    password: data.password,
    account_type: data.isDeliveryDriver ? 'delivery_driver' : 'customer',
  };
};

export const transformLoginData = (data: LoginData) => {
  return {
    phone_number: data.phoneNumber,
    password: data.password,
    account_type: data.isDeliveryDriver ? 'delivery_driver' : 'customer',
  };
};
