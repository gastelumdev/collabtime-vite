import { Box, Card, CardBody, Center, Container, Flex, Input, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import linkItems from '../../utils/linkItems';

import SideBarLayout from '../../components/Layouts/SideBarLayout';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import {
    useCallUpdateMutation,
    useCreateMessageMutation,
    useGetMessagesQuery,
    useGetOneWorkspaceQuery,
    useGetUserGroupsQuery,
    useGetUserQuery,
    useMarkAsReadMutation,
    useTypingMessageMutation,
} from '../../app/services/api';
import { Link, useParams } from 'react-router-dom';
import { formatTime } from '../../utils/helpers';
import { io } from 'socket.io-client';
import '../../App.css';

const View = () => {
    const { id } = useParams();
    const messagesEndRef = useRef<any>(null);
    const { data: messages } = useGetMessagesQuery(id || '');
    const { data: workspace, isFetching } = useGetOneWorkspaceQuery(id || '');
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');

    const [createMessage] = useCreateMessageMutation();
    const [callUpdate] = useCallUpdateMutation();
    const [typingMessage] = useTypingMessageMutation();
    const [markAsRead] = useMarkAsReadMutation();

    const [messageInput, setMessageInput] = useState<string>('');

    // const [usersTyping, setUsersTyping] = useState<TUser[]>([]);
    const [usersTyping, setUsersTyping] = useState<boolean>(false);
    const [userWhosTyping, setUserWhosTyping] = useState<any>(null);

    const [permissions, setPermissions] = useState({ view: false, create: false });

    const { data: userGroups, refetch } = useGetUserGroupsQuery(null);

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });
            setPermissions(ug.permissions.chat);
        } else {
            refetch();
        }
    }, [userGroups]);

    /**
     * Socket.io listening for update to refetch data
     */
    useEffect(() => {
        setUsersTyping(false);
        setUserWhosTyping(null);
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on('update-message', () => {
            callUpdate(null);
            setUsersTyping(false);
        });

        socket.on('user-typing-message', (typingUser) => {
            // setUsersTyping([...usersTyping, user]);
            if (user?._id !== typingUser.user._id) {
                setUsersTyping(true);
                setUserWhosTyping(typingUser);

                setTimeout(() => {
                    setUsersTyping(false);
                    setUserWhosTyping(null);
                }, 3000);
            }
        });

        return () => {
            socket.disconnect();
            setUsersTyping(false);
            setUserWhosTyping(null);
        };
    }, [typingMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Mark messages for this user as read
        markAsRead(null);

        return () => {
            runMarkAsRead();
        };
    }, []);

    const [newLinkItems, setNewLinkItems] = useState(linkItems);

    useEffect(() => {
        const newLinkItems = linkItems.map((item) => {
            if (item.name === 'Message Board') {
                return { ...item, active: true };
            }
            return { ...item, active: false };
        });

        setNewLinkItems(newLinkItems);
    }, [linkItems]);

    const runMarkAsRead = async () => {
        await markAsRead(null);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMessageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        typingMessage(null);
        setMessageInput(value);
    };

    const handleCreateMessageClick = () => {
        createMessage({
            content: messageInput,
            workspace: id || '',
        });
        setMessageInput('');
        scrollToBottom();
    };

    const handleCreateMessageOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            createMessage({
                content: messageInput,
                workspace: id || '',
            });
            setMessageInput('');
            scrollToBottom();
        }
    };
    return (
        <SideBarLayout linkItems={newLinkItems}>
            <Box mt={'30px'}>
                {/* <Flex minH={"100vh"} bg={"#eff2f5"}> */}
                <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                    <SimpleGrid spacing={6} columns={{ base: 1, sm: 2 }}>
                        <Flex>
                            <Box pl={'6px'}>
                                {!isFetching ? (
                                    <>
                                        <Link to={`/workspaces/${localStorage.getItem('workspaceId')}`}>
                                            <Text display={'inline'}>{`${workspace?.name}`}</Text>
                                        </Link>
                                        <Text display={'inline'} className="dmsans-600">
                                            {' / Message Board'}
                                        </Text>
                                    </>
                                ) : null}
                            </Box>
                        </Flex>
                        <Flex>
                            <Spacer />
                            <Box pb={'20px'}>{/* <Create addNewWorkspace={addNewWorkspace} /> */}</Box>
                        </Flex>
                    </SimpleGrid>

                    <Box w={'100%'}>
                        <Card>
                            <CardBody>
                                {permissions.view ? (
                                    <>
                                        {messages?.length || 0 > 0
                                            ? messages?.map((message, index) => {
                                                  return (
                                                      <Box key={index} mb={'10px'} width={'100%'}>
                                                          {user?._id === message?.createdBy?._id ? (
                                                              <>
                                                                  <Box display={'flex'} justifyContent={'flex-end'}>
                                                                      <Flex minW={'300px'} w={'40%'}>
                                                                          <Spacer />
                                                                          <Text fontSize={'12px'} mb={'3px'}>{`${message?.createdBy?.firstname} ${
                                                                              message?.createdBy?.lastname
                                                                          } - ${formatTime(message?.createdAt || new Date())}`}</Text>
                                                                      </Flex>
                                                                  </Box>
                                                                  <Box display={'flex'} justifyContent={'flex-end'}>
                                                                      <Box bgColor={'#2b81eb'} p={'10px'} borderRadius={'5px'} minW={'300px'} w={'40%'}>
                                                                          <Text color={'white'}>{message.content}</Text>
                                                                      </Box>
                                                                  </Box>
                                                              </>
                                                          ) : (
                                                              <Box>
                                                                  <Flex minW={'300px'} w={'40%'}>
                                                                      <Spacer />
                                                                      <Text fontSize={'12px'}>{`${message?.createdBy?.firstname} ${
                                                                          message?.createdBy?.lastname
                                                                      } - ${formatTime(message?.createdAt || new Date())}`}</Text>
                                                                  </Flex>
                                                                  <Box
                                                                      bgColor={'gray'}
                                                                      p={'10px'}
                                                                      borderRadius={'5px'}
                                                                      display={'inline-block'}
                                                                      minW={'300px'}
                                                                      w={'40%'}
                                                                  >
                                                                      <Text color={'white'}>{message.content}</Text>
                                                                  </Box>
                                                              </Box>
                                                          )}
                                                      </Box>
                                                  );
                                              })
                                            : 'No messages'}
                                        <Box h={'20px'}>
                                            <Center>
                                                {usersTyping && userWhosTyping.user._id !== user?._id ? (
                                                    <Text>{`${userWhosTyping.user.firstname} ${userWhosTyping.user.lastname} typing...`}</Text>
                                                ) : null}
                                            </Center>
                                        </Box>
                                    </>
                                ) : (
                                    <Text>You don't have access to view the chat.</Text>
                                )}
                            </CardBody>
                        </Card>
                        {permissions.view && permissions.create ? (
                            <Box mt={'10px'} mb={'20px'}>
                                <Box>
                                    <Card>
                                        <CardBody>
                                            <Flex>
                                                <Input
                                                    mr={'10px'}
                                                    value={messageInput}
                                                    onChange={handleMessageInputChange}
                                                    onKeyDown={handleCreateMessageOnKeyDown}
                                                />
                                                <PrimaryButton onClick={handleCreateMessageClick}>POST</PrimaryButton>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                    <div ref={messagesEndRef} />
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                </Container>
                {/* </Flex> */}
            </Box>
        </SideBarLayout>
    );
};

export default View;
