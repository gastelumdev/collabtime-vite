import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useCallNotificationsUpdateMutation, useGetEventsQuery, useGetUserGroupsQuery } from '../../app/services/api';
import { TEvent } from '../../types';
import { formatTime } from '../../utils/helpers';

const DisplayList = () => {
    const { data: events, refetch: refetchEvents, isLoading: eventsAreLoading } = useGetEventsQuery(null);
    const { data: userGroups } = useGetUserGroupsQuery(null);
    const [callNotificationsUpdate] = useCallNotificationsUpdateMutation();
    const [priority] = useState('All');

    const [userGroupName, setUserGroupName] = useState('No Access');
    const toast = useToast();

    useEffect(() => {
        refetchEvents();
    }, []);

    useEffect(() => {
        if (userGroups && userGroups !== undefined) {
            for (const userGroup of userGroups) {
                if (userGroup.users.includes(localStorage.getItem('userId'))) {
                    setUserGroupName(userGroup.name);
                }
            }
        }
    }, [userGroups]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on('notify', (data) => {
            if (data) {
                refetchEvents();
            }
        });

        socket.on('update', (item) => {
            callNotificationsUpdate(priority);

            toast({
                title: 'Notification',
                description: item,
                status: 'info',
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (eventsAreLoading) {
        return (
            <>
                <Box pt={'200px'}>
                    <Center>
                        <Spinner size={'lg'} />
                    </Center>
                </Box>
            </>
        );
    }

    return (
        <>
            <Box>
                <TableContainer>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Type</Th>
                                <Th>Data Collection</Th>
                                <Th>Event</Th>
                                <Th>Action by</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {events?.map((event: TEvent) => {
                                if (!event.associatedUserIds.includes(localStorage.getItem('userId') || '') && userGroupName !== 'All Privileges') {
                                    return null;
                                }
                                const date = new Date(event.createdAt);
                                // const formattedDate = date.toString().split('GMT')[0];
                                const formattedDate = formatTime(date);

                                return (
                                    <Tr key={event._id}>
                                        <Td>{formattedDate}</Td>
                                        <Td>{`${event.type.slice(0, 1).toUpperCase()}${event.type.slice(1)}`}</Td>
                                        <Td>{event.dataCollection?.name}</Td>
                                        <Td>{event.message}</Td>
                                        <Td>{`${event.actionBy.firstname} ${event.actionBy.lastname}`}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default DisplayList;
