import { Box, MenuButton, Text, useDisclosure } from '@chakra-ui/react';
import DisplayList from './DisplayList';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { LiaBell } from 'react-icons/lia';
import { useGetUnreadEventsQuery } from '../../app/services/api';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const View = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: unreadEvents, refetch: refetchUnreadEvents } = useGetUnreadEventsQuery(null);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update notification marker', () => {
            refetchUnreadEvents();
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <Box mt={'10px'} position={'relative'}>
            {unreadEvents && unreadEvents.length > 0 ? (
                <Box position={'absolute'} left={'13px'} borderRadius={'50%'} bgColor={'orange'} w={'8px'} h={'8px'}></Box>
            ) : null}
            <MenuButton bg={'#0f172a'} onClick={onOpen}>
                {/* <BellIcon boxSize={5} color={'white'} /> */}
                <Text color={'white'} fontSize={'20px'}>
                    <LiaBell />
                </Text>
            </MenuButton>
            <PrimaryDrawer title="Notifications" isOpen={isOpen} onClose={onClose} size="full">
                <DisplayList />
            </PrimaryDrawer>
        </Box>
    );
};

export default View;
