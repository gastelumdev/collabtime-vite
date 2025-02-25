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
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import GroupViewList from '../dataCollections/apps/controlByWebAppComponents/GroupViewList';
import { controlByWebSettings } from '../dataCollections/apps/controlByWebAppComponents/controlByWebSettings';

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
    const [access, setAccess] = useState(false);

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            if (ug !== undefined) {
                console.log(ug);
                setUserGroup(ug);
                setAccess(true);
            }
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

    const panasonicDashboard = () => {
        console.log({ userGroup });
        return (
            <Box>
                <GroupViewList />
            </Box>
        );
    };

    if (id === controlByWebSettings.psId && access && userGroup.name !== 'All Privileges') {
        return panasonicDashboard();
    }
    return (
        <>
            {workspace ? (
                <SideBarLayout linkItems={newLinkItems}>
                    <Box>
                        <Flex minH={'100vh'} bg={'#f6f8fa'}>
                            <Container maxW={'full'} mt={{ base: 0, sm: 0 }}>
                                <SimpleGrid spacing={1} columns={{ base: 1, sm: 2 }} pb={'10px'} mt={'0px'}>
                                    <Flex>
                                        <Box pt={workspace?.description === '' ? '10px' : '10px'} pl={'5px'}>
                                            <Text fontSize={'22px'} color={bgColor} pl={'10px'} pt={'10px'} className="dmsans-600">
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
                                        {userGroup !== undefined ? (
                                            <>
                                                {userGroup.permissions.workspace.invite ? (
                                                    <Box mt={'22px'}>
                                                        <Invite />
                                                    </Box>
                                                ) : null}
                                                {userGroup.permissions.workspace.update ||
                                                userGroup.permissions.workspace.delete ||
                                                userGroup.permissions.workspace.userGroups ? (
                                                    <Box mt={'14px'} ml={'3px'}>
                                                        <Menu>
                                                            <MenuButton pt={'8px'} ml={'5px'}>
                                                                {/* <PrimaryButton size="sm"> */}
                                                                <Box bgColor={'rgb(35, 148, 234)'} p={'5px'} borderRadius={'5px'}>
                                                                    <Text fontSize={'20px'} color={'white'}>
                                                                        <PiDotsThreeVerticalBold size={'18px'} />
                                                                    </Text>
                                                                </Box>
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
                                        ) : (
                                            <Text>No access</Text>
                                        )}
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
