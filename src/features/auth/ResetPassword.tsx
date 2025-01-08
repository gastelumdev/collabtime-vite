import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue } from '@chakra-ui/react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

import { useResetPasswordMutation } from '../../app/services/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    const [password, setPassword] = useState('');

    const [resetPassword] = useResetPasswordMutation();

    /**
     * Handles input changes
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    };

    const handleClick = () => {
        try {
            const params = {
                userId: queryParameters.get('id') || '',
                token: queryParameters.get('token') || '',
                password: password,
            };
            resetPassword(params);
            navigate('/workspaces');
        } catch (err) {}
    };

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={4} w={'full'} maxW={'md'} bg={useColorModeValue('white', 'gray.700')} rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Enter new password
                </Heading>

                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name={'password'} value={password} onChange={handleChange} />
                </FormControl>
                <Stack spacing={6}>
                    <PrimaryButton fontSize={'16px'} onClick={handleClick}>
                        Submit
                    </PrimaryButton>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default ResetPassword;
