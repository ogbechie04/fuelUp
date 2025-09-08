import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { API_BASE_URL } from '@env';
import { zodResolver } from '@hookform/resolvers/zod';
import Feather from '@expo/vector-icons/Feather';
import { LoginData, loginSchema } from '@/features/auth/loginSchema';
import { transformLoginData } from '@/utils/transformAuthData';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/auth-context';

const Login = () => {
  const { login, token, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: { phoneNumber: '', password: '', isDeliveryDriver: false },
  });

  const submitData = async (data: LoginData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformLoginData(data)),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });
      console.log('Login done');
      await login(result.access_token, result.user);
      router.push('/(tabs)');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
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
              <Text style={[styles.headingText]}>Welcome to FuelUp</Text>
              <Text style={[styles.BodyText]}>
                Please enter your details to log in and continue where you left
                off
              </Text>
            </View>

            {/* ------ login form and button ------ */}
            <View className="flex gap-14">
              {/* ------ login form ------ */}
              <View className="gap-4">
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
                <View className="gap-2">
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
                          className="flex w-3/4 justify-start "
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
                <Text style={[styles.loginButton]}>Log In</Text>
              </TouchableOpacity>
            </View>
            {/* ------ link to login page ------ */}
            <View className="flex flex-row items-center justify-center gap-1">
              <Text className="text-center" style={[styles.loginQuestionText]}>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text
                  className="font-medium text-primaryNormal"
                  style={[styles.loginText]}
                >
                  Sign Up
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
  loginButton: {
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

export default Login;
