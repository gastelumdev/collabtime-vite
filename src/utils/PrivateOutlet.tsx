// import { ReactNode } from "react";
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';

interface PrivateOutletProps {
    redirectPath?: string;
}

export function PrivateOutlet({ redirectPath = '/login' }: PrivateOutletProps) {
    const toast = useToast();
    const { status } = useParams();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update', (item: any) => {
            console.log('UPDATE IO');
            if (item && item.userId !== localStorage.getItem('userId')) {
                toast({
                    title: 'Notification',
                    description: item.message,
                    status: 'info',
                });
                // setNotifications(callNotificationsUpdate(priority) as any);
            }
        });

        if (status !== 'active') {
            socket.on('update-message', (item) => {
                if (item) {
                    toast({
                        title: `New message from ${item.message.createdBy.firstname} ${item.message.createdBy.lastname} in ${item.workspace.name}`,
                        description: item.message.content,
                        status: 'info',
                        duration: 5000,
                        isClosable: true,
                    });
                    // setNotifications(callNotificationsUpdate(priority) as any);
                }
            });
        }

        socket.on(localStorage.getItem('userId') || '', (item) => {
            console.log('FROM USER ID IO');
            if (item && item.userId !== localStorage.getItem('userId')) {
                toast({
                    title: 'Notification',
                    description: item.message,
                    status: item.priority === 'Low' ? 'success' : item.priority === 'Critical' ? 'error' : 'warning',
                    duration: 9000,
                });
            }
        });

        socket.on('passwordReset', (item: any) => {
            if (item && item.userId === localStorage.getItem('userId')) {
                toast({
                    title: 'Notification',
                    description: item.message,
                    status: 'info',
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [status]);

    if (!localStorage.getItem('workspaceId')) localStorage.setItem('workspaceId', 'none');

    if (!localStorage.getItem('token')) {
        localStorage.removeItem('userId');
        localStorage.removeItem('dataCollectionId');
    }

    return localStorage.getItem('token') ? <Outlet /> : <Navigate to={redirectPath} />;
}
