import React, { useState } from 'react';
import { Stack, router } from 'expo-router';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_BASE_URL } from '@env';
import Toast from 'react-native-toast-message';
import Feather from '@expo/vector-icons/Feather';
import { SignUpData, signUpSchema } from '@/features/auth/signUpSchema';
import { transformSignUpData } from '@/utils/transformAuthData';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      isDeliveryDriver: false,
    },
  });

  const submitData = async (data: SignUpData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformSignUpData(data)),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'Welcome to FuelUp!',
      });
      console.log('User created');
      router.push('/(tabs)');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message?.includes('Network request failed')
          ? 'Network error. Please check your connection.'
          : error.message || 'Please try again',
      });
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white500">
        <ScrollView className="flex-1 bg-white500">
          <View className="mx-6 flex-1 gap-8">
            {/* ------  heading texts ------ */}
            <View className="mt-6 gap-3">
              <Text style={[styles.headingText]}>Let&apos;s get started</Text>
              <Text style={[styles.BodyText]}>
                Please fill in your details to create your account and unlock
                the full experienece
              </Text>
            </View>

            {/* ------ signup form and button ------ */}
            <View className="flex gap-14">
              {/* ------ signup form ------ */}
              <View className="gap-4">
                {/* ------ first name ------ */}
                <View className="gap-2">
                  <Text style={[styles.inputLabelText]}>First Name</Text>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        inputMode="text"
                        placeholder="Enter First Name"
                        placeholderTextColor={'#D9D9D9'}
                        style={[styles.inputText]}
                        className={`flex w-full justify-start rounded-lg border bg-primaryInputField py-3 pl-4 ${errors.firstName ? 'border-foundationErrorNormal' : 'border-transparent'}`}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <Text className="text-[11px] leading-normal text-foundationErrorNormal">
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>

                {/* ------ last name ------ */}
                <View className="gap-2">
                  <Text style={[styles.inputLabelText]}>Last Name</Text>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        inputMode="text"
                        placeholder="Enter Last Name"
                        placeholderTextColor={'#D9D9D9'}
                        style={[styles.inputText]}
                        className={`flex w-full justify-start rounded-lg border bg-primaryInputField py-3 pl-4 ${errors.lastName ? 'border-foundationErrorNormal' : 'border-transparent'}`}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <Text className="text-[11px] leading-normal text-foundationErrorNormal">
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
                {/* ------ email address ------ */}
                <View className="gap-2">
                  <Text style={[styles.inputLabelText]}>Email Address</Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        inputMode="email"
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        placeholderTextColor={'#D9D9D9'}
                        style={[styles.inputText]}
                        className={`flex w-full justify-start rounded-lg border bg-primaryInputField py-3 pl-4 ${errors.email ? 'border-foundationErrorNormal' : 'border-transparent'}`}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text className="text-[11px] leading-normal text-foundationErrorNormal">
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                {/* ------ phone number ------ */}
                <View className="gap-2">
                  <Text style={[styles.inputLabelText]}>Phone Number</Text>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        inputMode="numeric"
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        placeholderTextColor={'#D9D9D9'}
                        style={[styles.inputText]}
                        className={`flex w-full justify-start rounded-lg border bg-primaryInputField py-3 pl-4 ${errors.phoneNumber ? 'border-foundationErrorNormal' : 'border-transparent'}`}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <Text className="text-[11px] leading-normal text-foundationErrorNormal">
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>

                {/* ------ password ------ */}
                <View className={`gap-2`}>
                  <Text style={[styles.inputLabelText]}>Password</Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        className={`w-full flex-row justify-between rounded-lg border bg-primaryInputField px-4 py-3 *:flex ${errors.password ? 'border-foundationErrorNormal' : 'border-transparent'}`}
                      >
                        <TextInput
                          inputMode="text"
                          placeholder="Enter password"
                          keyboardType="default"
                          secureTextEntry={!showPassword}
                          placeholderTextColor={'#D9D9D9'}
                          style={[styles.inputText]}
                          className={`flex w-3/4 justify-start `}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                        />

                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                        >
                          <Feather
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={24}
                            color="#84868C"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text className="text-[11px] leading-normal text-foundationErrorNormal">
                      {errors.password.message}
                    </Text>
                  )}
                </View>

                {/* ------ delivery driver? ------ */}
                <View className="mt-3 flex-row items-center gap-2">
                  <Controller
                    control={control}
                    name="isDeliveryDriver"
                    defaultValue={false}
                    render={({ field: { value, onChange } }) => (
                      <TouchableOpacity
                        onPress={() => onChange(!value)}
                        className="flex-row items-center gap-2"
                      >
                        <View className="h-5 w-5 items-center justify-center rounded border border-primaryNormal">
                          {value && (
                            <Feather name="check" size={16} color="#007095" />
                          )}
                        </View>
                        <Text style={[styles.inputLabelText]}>
                          Are you a delivery driver?
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
              {/* ------ sign up button ------ */}
              <TouchableOpacity
                className="flex w-full items-center justify-center rounded-xl bg-primaryNormal py-2.5"
                onPress={handleSubmit(submitData)}
              >
                <Text style={[styles.signUpButton]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            {/* ------ link to login page ------ */}
            <View className="flex flex-row items-center justify-center gap-1">
              <Text className="text-center" style={[styles.loginQuestionText]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text
                  className="font-medium text-primaryNormal"
                  style={[styles.loginText]}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headingText: {
    fontSize: 20,
    // fontWeight: '500',
    lineHeight: 36,
    fontFamily: 'Satoshi-Medium',
  },
  BodyText: {
    fontSize: 12,
    lineHeight: 19,
    fontFamily: 'Satoshi-Regular',
  },
  inputLabelText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 25,
  },
  inputText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
  },
  signUpButton: {
    fontFamily: 'Satoshi-Medium',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 29,
  },
  loginQuestionText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  loginText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 12,
  },
});

export default Signup;
