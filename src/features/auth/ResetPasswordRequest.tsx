import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, Flex, Heading, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react';

import { useAuth } from '../../hooks/useAuth';
import { useResetPasswordRequestMutation } from '../../app/services/api';

import PrimaryButton from '../../components/Buttons/PrimaryButton';

const ResetPasswordRequest = () => {
    const navigate = useNavigate();
    const [resetPasswordRequest] = useResetPasswordRequestMutation();
    const [email, setEmail] = useState(useAuth().user?.email || '');

    const handleClick = () => {
        try {
            resetPasswordRequest({ email }).unwrap();
            navigate('/resetPasswordEmailSent');
        } catch (err) {}
    };

    /**
     * Handles input changes
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
    };

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={4} w={'full'} maxW={'md'} bg={useColorModeValue('white', 'gray.700')} rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: 'xl', md: '2xl' }}>
                    Forgot your password?
                </Heading>
                <Text fontSize={{ base: 'sm', sm: 'md' }} color={'#7b809a'}>
                    You&apos;ll get an email with a reset link
                </Text>
                <FormControl id="email">
                    <Input
                        placeholder="your-email@example.com"
                        _placeholder={{ color: 'gray.500' }}
                        type="email"
                        value={email}
                        onChange={handleChange}
                        color={'#7b809a'}
                    />
                </FormControl>
                <Stack spacing={6}>
                    <PrimaryButton fontSize={'16px'} onClick={handleClick}>
                        Request Reset
                    </PrimaryButton>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default ResetPasswordRequest;
