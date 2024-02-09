import { useEffect, useState } from 'react';
import {
    useGetWorkspacesQuery,
    useCreateWorkspaceMutation,
    useDeleteWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useCallUpdateMutation,
    useGetUserQuery,
    useDeleteTagMutation,
    useTagExistsMutation,
} from '../../app/services/api';

import { io } from 'socket.io-client';

import { Box, Container, Flex, Heading, SimpleGrid, Spacer, Text, Center, useToast } from '@chakra-ui/react';

import { TWorkspace, LinkItemProps, TTag } from '../../types';
import Create from './Create';
import Edit from './Edit';

import SideBarLayout from '../../components/Layouts/SideBarLayout';
import PrimaryCard from '../../components/PrimaryCard';
import { BsPersonWorkspace } from 'react-icons/bs';
import TagsModal from '../tags/TagsModal';
import Delete from './Delete';
import logo from '../../assets/logo-no-background.png';
import mvpLogo from '../../assets/MVPOriginalLogo.png';

const LinkItems: Array<LinkItemProps> = [{ name: 'Workspaces', icon: BsPersonWorkspace, path: '/workspaces' }];

/**
 * This is the default workspace view that renders all workspaces
 * @prop {null}
 * @returns {JSX}
 */
const View = () => {
    const { data } = useGetWorkspacesQuery(null);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const [createWorkspace, { isError: createWorkspaceIsError, error: createWorkspaceError }] = useCreateWorkspaceMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();
    const [deleteWorkspace] = useDeleteWorkspaceMutation();
    const [callUpdate] = useCallUpdateMutation();
    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();
    const [pageLogo, setPageLogo] = useState('');

    useEffect(() => {
        setPageLogo(user?.email !== 'islas@mvpsecuritysystems.com' ? logo : mvpLogo);
    }, [user]);

    const toast = useToast();

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    /**
     * Socket.io listening for update to refetch data
     */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on('update', () => {
            callUpdate(null);
        });

        socket.on('getWorkspaces-' + localStorage.getItem('userId'), () => {});

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        for (const workspace of data || []) {
            for (const member of workspace.members) {
                if (member.email === user?.email && member.permissions > 1) {
                    setIsAuthorized(true);
                }
            }
        }
    }, [data, user]);

    const handleCloseTagButtonClick = async (workspace: TWorkspace, tag: TTag) => {
        const { tags } = workspace;

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const newWorkspace = { ...workspace, tags: filteredTags };
        const updatedWorkspaceRes: any = await updateWorkspace(newWorkspace);
        const updatedWorkspace = updatedWorkspaceRes.data;

        const { workspaceTags } = updatedWorkspace;

        const thisTagExistsRes: any = await tagExists(tag);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace = { ...updatedWorkspace, workspaceTags: filteredWorkspaceTags };
            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
    };

    if (createWorkspaceIsError) {
        toast({
            title: 'Create Workspace Error',
            description: (createWorkspaceError as any)?.data.error._message,
            status: 'error',
        });
    }

    return (
        <SideBarLayout
            linkItems={LinkItems}
            leftContent={
                <Box pt={'30px'} pb={'4px'}>
                    <img src={pageLogo} width={user?.email === 'islas@mvpsecuritysystems.com' ? '90px' : '30px'} />
                </Box>
            }
            sidebar={false}
        >
            <Box>
                <Flex minH={'100vh'} bg={'#eff2f5'}>
                    <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid spacing={6} columns={{ base: 1, sm: 2 }} pb={'50px'}>
                            <Flex>
                                <Box>
                                    <Heading size={'sm'} mb={'12px'} color={'rgb(52, 71, 103)'}>
                                        <Text>Workspaces</Text>
                                    </Heading>
                                    <Text color={'rgb(123, 128, 154)'} fontSize={'md'} fontWeight={300}>
                                        Create a new workspace to manage your projects and teams.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={'20px'}>
                                    <Create addNewWorkspace={createWorkspace} />
                                </Box>
                            </Flex>
                        </SimpleGrid>
                        {data?.length || 0 > 0 ? (
                            <SimpleGrid
                                spacing={6}
                                columns={{
                                    base: 1,
                                    sm: 1,
                                    md: 2,
                                    lg: 3,
                                    xl: 3,
                                }}
                            >
                                {data?.map((workspace: TWorkspace, index: number) => {
                                    return (
                                        <PrimaryCard
                                            key={index}
                                            index={index}
                                            data={workspace}
                                            redirectUrl={`/workspaces/${workspace._id}`}
                                            localStorageId="workspaceId"
                                            divider={workspace?.owner === localStorage.getItem('userId') || isAuthorized}
                                            editButton={
                                                workspace?.owner === localStorage.getItem('userId') || isAuthorized ? (
                                                    <Edit workspace={workspace} updateWorkspace={updateWorkspace} />
                                                ) : null
                                            }
                                            deleteButton={
                                                workspace?.owner === localStorage.getItem('userId') || isAuthorized ? (
                                                    <Delete workspace={workspace} deleteWorkspace={deleteWorkspace} />
                                                ) : null
                                            }
                                            tagButton={
                                                workspace?.owner === localStorage.getItem('userId') || isAuthorized ? (
                                                    <TagsModal
                                                        tagType={'workspace'}
                                                        data={workspace}
                                                        tags={workspace.tags}
                                                        update={updateWorkspace}
                                                        workspaceId={workspace._id || ''}
                                                    />
                                                ) : null
                                            }
                                            handleCloseTagButtonClick={handleCloseTagButtonClick}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                        ) : (
                            <Center>
                                <Text color={'rgb(123, 128, 154)'}>Your workspaces list is empty.</Text>
                            </Center>
                        )}
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
    );
};

export default View;
