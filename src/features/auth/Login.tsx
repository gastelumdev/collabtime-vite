'use client';

import { Flex, Box, FormControl, FormLabel, Input, Stack, Heading, useColorModeValue, useToast, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from './types';
import { useLoginMutation } from '../../app/services/api';
import { setCredentials } from './authSlice';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const [login] = useLoginMutation();

    const [formState, setFormState] = useState<LoginRequest>({
        email: '',
        password: '',
    });
    const [emailInputError, setEmailInputError] = useState(false);
    const [passwordInputError, setPasswordInputError] = useState(false);

    const handleSubmit = async () => {
        if (formState.email !== '' && formState.password !== '') {
            try {
                const user: any = await login(formState).unwrap();
                dispatch(setCredentials(user));
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('userId', user.user._id as string);
                localStorage.setItem('notificationsFilter', 'All');
                localStorage.setItem('workspaceId', user.user.defaultWorkspaceId);
                navigate('/workspaces/' + user.user.defaultWorkspaceId);
            } catch (err: any) {
                toast({
                    title: 'Login Error.',
                    description: err.data.message,
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } else {
            if (formState.email === '') setEmailInputError(true);
            if (formState.password === '') setPasswordInputError(true);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
        setEmailInputError(false);
        setPasswordInputError(false);
    };

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    {/* <Text fontSize={"lg"} color={"gray.600"}>
                        to enjoy all of our cool{" "}
                        <Text color={"blue.400"}>features</Text> ✌️
                    </Text> */}
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired={true} isInvalid={emailInputError}>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" name={'email'} value={formState.email} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="password" isRequired={true} isInvalid={passwordInputError}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name={'password'} value={formState.password} onChange={handleChange} isRequired={true} />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                                {/* <Checkbox>Remember me</Checkbox> */}
                                <Box></Box>
                                <Link href="/resetPasswordRequest" color={'blue.400'}>
                                    Forgot password?
                                </Link>
                            </Stack>
                            <PrimaryButton fontSize={'16px'} onClick={handleSubmit}>
                                Sign in
                            </PrimaryButton>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
