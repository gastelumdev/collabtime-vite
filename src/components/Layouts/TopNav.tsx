import {
    Avatar,
    Box,
    Center,
    Flex,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Container,
    Hide,
} from '@chakra-ui/react';
import { theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import View from '../../features/notifications/View';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
interface INavProps {
    logo?: string;
    firstname?: string;
    lastname?: string;
    breadcrumbs?: ReactNode;
    // children: ReactNode;
}

const TopNav = ({ firstname, lastname, breadcrumbs }: INavProps) => {
    const navigate = useNavigate();
    const logout = () => {
        navigate('/login');
    };

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstname}%20${lastname}`;

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Header
            style={{
                padding: '0',
                background: colorBgContainer,
                // marginBottom: "30px",
            }}
        >
            <Flex
                minH={'100vh'}
                // justify={"center"}
                bg={'#f6f8fa'}
            >
                <Container maxW={'8xl'} mt={{ base: 0 }}>
                    <Box pb={3} bg={'#f6f8fa'}>
                        <Box bg={'#f6f8fa'}>
                            <SimpleGrid
                                spacing={4}
                                // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                columns={[1, 2, 2]}
                            >
                                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                                    <Box pt={'18px'} bg={'#f6f8fa'}>
                                        {breadcrumbs}
                                    </Box>
                                </Flex>
                                <Flex>
                                    <Hide below="sm">
                                        <Spacer />
                                    </Hide>

                                    <Stack direction={'row'} spacing={6}>
                                        {/* <Box paddingRight={"0px"}>
                                            <Input
                                                borderColor={"#c7cadb"}
                                                placeholder="Search here..."
                                                w={200}
                                            />
                                        </Box> */}
                                        <Menu>
                                            <View />
                                        </Menu>
                                        <Menu>
                                            <MenuButton
                                                // as={Button}
                                                style={{
                                                    backgroundColor: '#f6f8fa',
                                                }}
                                                // cursor={"pointer"}
                                                // minW={0}
                                            >
                                                {/* <BellIcon
                                            boxSize={5}
                                            color={"#3E505B"}
                                        /> */}
                                                <Text size={'20px'}>
                                                    <IconContext.Provider
                                                        value={{
                                                            size: '18px',
                                                            color: '#7b809a',
                                                        }}
                                                    >
                                                        <FaUserCircle />
                                                    </IconContext.Provider>
                                                </Text>
                                            </MenuButton>
                                            <MenuList alignItems={'center'}>
                                                <br />
                                                <Center>
                                                    <Avatar size={'lg'} src={avatarUrl} />
                                                </Center>
                                                <br />
                                                <Center>
                                                    <p>{`${firstname} ${lastname}`}</p>
                                                </Center>
                                                <Center>
                                                    <p
                                                        style={{
                                                            fontSize: '12px',
                                                            color: 'gray',
                                                        }}
                                                    >
                                                        gastelumdev@gmail.com
                                                    </p>
                                                </Center>
                                                <br />
                                                <MenuDivider />
                                                {/* <MenuItem>Profile</MenuItem> */}
                                                <MenuItem onClick={logout}>Logout</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Stack>
                                </Flex>
                            </SimpleGrid>
                        </Box>
                    </Box>
                </Container>
            </Flex>
        </Header>
    );
};

export default TopNav;
