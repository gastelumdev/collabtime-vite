import { useParams, Navigate } from 'react-router-dom';

import {
    useGetOneWorkspaceQuery,
    useGetWorkspaceUsersQuery,
    useGetUserQuery,
    // useGetUnreadMessagesQuery,
    useCallUpdateMessagesMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,
    useGetWorkspacesQuery,
    useGetUserGroupsQuery,
} from '../../app/services/api';

import { Avatar, AvatarGroup, Box, Container, Flex, Menu, MenuButton, MenuList, SimpleGrid, Spacer, Text, useToast } from '@chakra-ui/react';
import { IoSettingsOutline } from 'react-icons/io5';

import linkItems from '../../utils/linkItems';
import { TUser } from '../../types';

import SideBarLayout from '../../components/Layouts/SideBarLayout';
import Invite from './Invite';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ViewList from '../dataCollections/ViewList';
// import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Edit from './Edit';
import Delete from './Delete';
import { bgColor } from '../../utils/colors';
import '../../App.css';
import UserGroups, { emptyPermissions } from './UserGroups';

/**
 * This funcion renders a workspace when selected from the workspaces page
 * The page will be obtained by the id in the url ex. /workspaces/:id
 * This may change with Redux since the workspace id will be saved in local
 * storage.
 * @returns {JSX}
 */
const ViewOne = () => {
    const { id } = useParams();
    const { data: workspaces } = useGetWorkspacesQuery(null);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: workspace, isError, error } = useGetOneWorkspaceQuery(id as string);
    const { data: workspaceUser } = useGetWorkspaceUsersQuery(id as string);
    const [updateWorkspace] = useUpdateWorkspaceMutation();
    const [deleteWorkspace] = useDeleteWorkspaceMutation();

    const toast = useToast();

    // const { data: unreadMessages } = useGetUnreadMessagesQuery(null);

    const [callUpdateMessages] = useCallUpdateMessagesMutation();

    const [permissions, setPermissions] = useState<number>();

    const [active, setActive] = useState(true);

    useEffect(() => {
        if (workspace?.settings?.integration.swiftSensors.active !== undefined) {
            setActive(workspace?.settings?.integration.swiftSensors.active);
        }
    }, [workspace]);

    /**
     * Socket.io listening for update to refetch data
     */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on('notify', (data) => {
            if (data.allAssigneeIds.includes(localStorage.getItem('userId'))) {
                if (data.event.actionBy._id !== localStorage.getItem('userId') && data.event.workspace === localStorage.getItem('workspaceId')) {
                    console.log(data);
                    toast({
                        title: `Update`,
                        description: data.event.message,
                        duration: 10000,
                        status: 'info',
                        isClosable: true,
                        position: 'bottom-right',
                    });
                }

                if (data.event.type === 'error') {
                    console.log(data);
                    toast({
                        title: `Update`,
                        description: data.event.message,
                        duration: 10000,
                        status: 'error',
                        isClosable: true,
                        position: 'bottom-right',
                    });
                }
            }
        });

        socket.on('update-message', () => {
            callUpdateMessages(null);
        });

        socket.on(`integrations error ${id}`, (error) => {
            toast({
                title: `${error.integrationType} request failed`,
                description: error.errorMsg,
                duration: 10000,
                status: 'error',
                isClosable: true,
                position: 'bottom-right',
            });

            setActive(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('workspaceId', id || '');

        getPermissions();
    }, [user, error]);

    const { data: userGroups } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });
            setUserGroup(ug);
        }
    }, [userGroups]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    const [newLinkItems, setNewLinkItems] = useState(linkItems);

    useEffect(() => {
        const newLinkItems = linkItems.map((item) => {
            if (item.name === 'Dashboard') {
                return { ...item, active: true };
            }
            return { ...item, active: false };
        });

        setNewLinkItems(newLinkItems);
    }, [linkItems]);

    if (isError) return <Navigate to={'/workspaces'} />;

    return (
        <>
            {workspace ? (
                <SideBarLayout linkItems={newLinkItems}>
                    <Box>
                        <Flex minH={'100vh'} bg={'#f6f8fa'}>
                            <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                                <SimpleGrid spacing={6} columns={{ base: 1, sm: 2 }} pb={'30px'} mt={'18px'}>
                                    <Flex>
                                        <Box pt={workspace?.description === '' ? '30px' : '10px'} pl={'5px'}>
                                            <Text fontSize={'22px'} color={bgColor} mb={'3px'} className="dmsans-600">
                                                {workspace?.name}
                                            </Text>
                                            <Text fontSize={'14px'} color={'#64758E'} className="dmsans-400">
                                                {workspace?.description}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <Spacer />
                                        <Box pt={'30px'} mr={'10px'}>
                                            <Text fontSize={'14px'} color={'#64758E'} className="dmsans-400">
                                                Team Members:
                                            </Text>
                                        </Box>
                                        <Box pt={'22px'}>
                                            <AvatarGroup size="sm" max={5} mr={'18px'}>
                                                {workspaceUser?.members.map((member: TUser, index: number) => {
                                                    return (
                                                        <Avatar
                                                            key={index}
                                                            name={`${member.firstname[0]}${member.lastname[0]}`}
                                                            getInitials={(name: string) => {
                                                                return name;
                                                            }}
                                                            _hover={{ zIndex: 10 }}
                                                            cursor={'default'}
                                                        />
                                                    );
                                                })}
                                            </AvatarGroup>
                                        </Box>
                                        {
                                            <>
                                                {userGroup.permissions.workspace.invite ? (
                                                    <Box mt={'22px'}>
                                                        <Invite />
                                                    </Box>
                                                ) : null}
                                                {userGroup.permissions.workspace.update ||
                                                userGroup.permissions.workspace.delete ||
                                                userGroup.permissions.workspace.userGroups ? (
                                                    <Box mt={'20px'} ml={'6px'}>
                                                        <Menu>
                                                            <MenuButton pt={'8px'} ml={'5px'}>
                                                                {/* <PrimaryButton size="sm"> */}
                                                                <Text fontSize={'20px'}>
                                                                    <IoSettingsOutline />
                                                                </Text>
                                                                {/* </PrimaryButton> */}
                                                            </MenuButton>
                                                            <MenuList fontSize={'13px'}>
                                                                {userGroup.permissions.workspace.update ? (
                                                                    <Edit workspace={workspace!} updateWorkspace={updateWorkspace} workspaces={workspaces} />
                                                                ) : null}
                                                                {userGroup.permissions.workspace.delete ? (
                                                                    <Delete workspace={workspace!} deleteWorkspace={deleteWorkspace} />
                                                                ) : null}
                                                                {userGroup.permissions.workspace.userGroups ? <UserGroups /> : null}
                                                            </MenuList>
                                                        </Menu>
                                                    </Box>
                                                ) : null}
                                            </>
                                        }
                                    </Flex>
                                </SimpleGrid>
                                <Box>
                                    <ViewList allowed={(permissions || 0) > 1} active={active} />
                                </Box>
                            </Container>
                        </Flex>
                    </Box>
                </SideBarLayout>
            ) : null}
        </>
    );
};

export default ViewOne;
