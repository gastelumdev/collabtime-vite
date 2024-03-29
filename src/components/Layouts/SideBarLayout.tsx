import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useGetUserQuery } from '../../app/services/api';

import {
    IconButton,
    Avatar,
    Box,
    Flex,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Center,
    Container,
    Spacer,
    Stack,
    Tooltip,
} from '@chakra-ui/react';
import { FiMenu, FiLogOut } from 'react-icons/fi';

import { IconContext, IconType } from 'react-icons';
import Divider from '../Divider/Divider';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import View from '../../features/notifications/View';
import Search from '../../features/search/View';

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
}

interface TopNavProps extends FlexProps {
    sidebar?: boolean;
    leftContent?: any;
    onOpen: () => void;
}

interface SidebarProps extends BoxProps {
    linkItems: LinkItemProps[];
    isOpen: any;
    onClose: any;
}

interface SidebarContentProps {
    sidebar?: boolean;
    linkItems: LinkItemProps[];
    leftContent?: any;
    children: ReactNode;
}

const mvpUserEmails = ['islas@mvpsecuritysystems.com', 'jvargas@mvpsecuritysystems.com', 'acastro@mvpsecuritysystems.com'];

const SidebarContent = ({ linkItems, onClose, isOpen, ...rest }: SidebarProps) => {
    const { data: userData } = useGetUserQuery(localStorage.getItem('userId') as string);
    const height = window.innerHeight;
    const [sidebarHeight, setSidebarHeight] = useState(height);

    const resizeSidebar = useCallback(() => {
        setSidebarHeight(window.innerHeight);
    }, [sidebarHeight]);

    const [user, setUser] = useState(userData);

    useEffect(() => {
        setUser(userData);
    }, [userData]);

    useEffect(() => {
        window.addEventListener('resize', resizeSidebar);

        return () => {
            window.removeEventListener('resize', resizeSidebar);
        };
    }, []);
    return (
        <Box
            transition="3s ease"
            borderRight="px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: '80px' }}
            pos="fixed"
            // h={window.innerHeight}
            h={'100%'}
            p={'0'}
            {...rest}
        >
            <Box bg={'black'} h={height}>
                <Box
                    pt={'20px'}
                    bgImage={mvpUserEmails.includes(user?.email || '') ? 'black' : 'radial-gradient(circle at center top, rgb(66, 66, 74), black)'}
                    height={'full'}
                    // borderRadius={'xl'}
                >
                    <Box pt={'6px'} pb={'4px'}>
                        <Center>
                            <Text as={'b'} fontSize={'16px'} color={'white'}>
                                {/* <LikeOutlined
                                    style={{
                                        marginRight: "4px",
                                        fontSize: "20px",
                                    }}
                                /> */}
                                <img src={user?.logoURL} width={mvpUserEmails.includes(user?.email || '') ? '55px' : '30px'} />
                            </Text>
                        </Center>
                    </Box>
                    <Divider gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)" marginBottom="10px" />
                    <Box transition="3s ease">
                        {linkItems.map((link, index) => (
                            <Box key={index}>
                                <Tooltip
                                    label={link.name}
                                    openDelay={0}
                                    // isDisabled={isFocused}
                                    placement={'right'}
                                >
                                    <Link to={link.path}>
                                        <NavItem key={link.name} icon={link.icon}>
                                            {isOpen ? <Text color={'white'}>{link.name}</Text> : null}
                                        </NavItem>
                                    </Link>
                                </Tooltip>
                                {link.name === 'Workspaces' ? (
                                    <Divider gradient="radial-gradient(#5e5b5b 40%, black)" marginBottom="10px" marginTop="10px" />
                                ) : null}
                            </Box>
                        ))}
                        <Divider gradient="radial-gradient(#5e5b5b 40%, black)" marginBottom="10px" marginTop="10px" />
                        <Tooltip
                            label={'Logout'}
                            openDelay={0}
                            // isDisabled={isFocused}
                            placement={'top'}
                        >
                            <Link to={'/login'}>
                                <NavItem icon={FaSignOutAlt}>{isOpen ? <Text color={'white'}>Logout</Text> : null}</NavItem>
                            </Link>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            // _hover={{
            //     bgImage: 'linear(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
            //     color: 'white',
            // }}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="19"
                    _groupHover={{
                        color: '#24a2f0',
                    }}
                    as={icon}
                    color={'lightgray'}
                />
            )}
            {children}
        </Flex>
    );
};

const TopNav = ({ sidebar = true, onOpen, leftContent, ...rest }: TopNavProps) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };
    const { data } = useGetUserQuery(localStorage.getItem('userId') as string);

    return (
        <Flex
            ml={{ base: 0, lg: sidebar ? '400px' : '0' }}
            pl={{ base: 0, lg: 0 }}
            pt={'35px'}
            h={{ sm: '22px' }}
            mb={{ sm: '20px' }}
            alignItems="center"
            // bg={useColorModeValue('gray.100', 'gray.900')}
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}
        >
            <Container maxW={'full'} mt={{ base: 0 }} px={'18px'}>
                <Box pb={3} bg={'#f6f8fa'}>
                    <Box bg={'#f6f8fa'}>
                        {/* <SimpleGrid columns={[1, 2, 2]} spacingY={{ sm: 3 }}> */}
                        <Flex alignItems={'center'} justifyContent={'space-between'}>
                            <IconButton display={{ base: 'flex', lg: 'none' }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />
                            <Box
                                ml={{ base: 3, lg: 0 }}
                                // pt={"18px"}
                                bg={'#f6f8fa'}
                            >
                                {leftContent}
                            </Box>
                            <Spacer />
                            <Stack direction={'row'} spacing={6}>
                                <Menu>
                                    <Search />
                                </Menu>
                                <Menu>
                                    <View />
                                </Menu>
                                <Menu autoSelect={false}>
                                    <MenuButton
                                        style={{
                                            backgroundColor: '#f6f8fa',
                                        }}
                                    >
                                        <Text size={'20px'} pt={1}>
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
                                    <MenuList alignItems={'center'} zIndex={'10'}>
                                        <br />
                                        <Center>
                                            <Avatar size={'lg'} src={`https://api.dicebear.com/7.x/initials/svg?seed=${data?.firstname}%20${data?.lastname}`} />
                                        </Center>
                                        <br />
                                        <Center>
                                            <p>{`${data?.firstname} ${data?.lastname}`}</p>
                                        </Center>
                                        <Center>
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: 'gray',
                                                }}
                                            >
                                                {data?.email}
                                            </p>
                                        </Center>
                                        <br />
                                        <MenuDivider />
                                        <MenuItem color={'#7b809a'} onClick={() => navigate('/resetPasswordRequest')}>
                                            Reset Password
                                        </MenuItem>
                                        {/* <MenuItem color={'#7b809a'} onClick={() => navigate('/resetPasswordRequest')}>
                                            Change Logo
                                        </MenuItem> */}
                                        <MenuItem onClick={logout} color={'#7b809a'}>
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Stack>
                        </Flex>
                        {/* <Flex mt={"10px"}>
                                <Hide below="sm">
                                    <Spacer />
                                </Hide>
                            </Flex> */}
                        {/* </SimpleGrid> */}
                    </Box>
                </Box>
            </Container>
            {/* </Flex> */}
        </Flex>
    );
};

const SideBarLayout = ({ linkItems, leftContent, sidebar = true, children }: SidebarContentProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: userData } = useGetUserQuery(localStorage.getItem('userId') as string);

    // useEffect(() => {
    //     console.log(userData?.email, userData?.logoURL);
    //     console.log(mvpUserEmails.includes(userData?.email || ''));
    // }, [userData]);

    return (
        <Box minH="100vh" bg={"useColorModeValue('gray.100', 'gray.900')"} pl={{ base: 0, lg: 0 }} pr={0} pt={0}>
            {sidebar ? <SidebarContent linkItems={linkItems} onClose={onClose} isOpen={isOpen} display={{ base: 'none', lg: 'block' }} /> : null}
            <Box mx={'6px'} ml={'6px'} h={'full'}>
                <Drawer isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="xs">
                    <DrawerContent boxShadow={'none'}>
                        <Box py={6} pl={6} minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                            <Box
                                pt={'20px'}
                                bgImage={
                                    mvpUserEmails.includes(userData?.email || '')
                                        ? 'radial-gradient(black, black)'
                                        : 'radial-gradient(circle at center top, rgb(66, 66, 74), black)'
                                }
                                height={'full'}
                                borderRadius={'xl'}
                            >
                                <Box pt={'6px'} pb={'4px'}>
                                    <Center>
                                        <Text as={'b'} fontSize={'16px'} color={'white'}>
                                            {/* <LikeOutlined
                                                style={{
                                                    marginRight: "4px",
                                                    fontSize: "20px",
                                                }}
                                            /> */}
                                            <img src={userData?.logoURL} width={mvpUserEmails.includes(userData?.email || '') ? '120px' : '30px'} />
                                        </Text>
                                    </Center>
                                </Box>
                                <Divider gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)" marginBottom="10px" />
                                <Box transition="3s ease">
                                    {linkItems.map((link) => (
                                        <Link to={link.path} key={link.name}>
                                            <NavItem key={link.name} icon={link.icon}>
                                                <Text color={'#dbdbdb'}>{link.name}</Text>
                                            </NavItem>
                                        </Link>
                                    ))}
                                    <Divider gradient="radial-gradient(#5e5b5b 40%, black)" marginBottom="10px" marginTop="10px" />
                                    <Link to={'/login'}>
                                        <NavItem icon={FiLogOut}>
                                            <Text color={'#dbdbdb'}>Logout</Text>
                                        </NavItem>
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </DrawerContent>
                </Drawer>
            </Box>
            {/* mobilenav */}
            <Box ml={{ base: 0, lg: sidebar ? '100px' : '0' }} p={{ base: 0 }}>
                <TopNav sidebar={false} onOpen={onOpen} leftContent={leftContent} />
            </Box>
            <Box
                ml={{ base: 0, lg: sidebar ? '85px' : '0' }}
                p={{ base: 0 }}
                pt={{
                    base: sidebar ? '0px' : '20px',
                    lg: sidebar ? '0px' : '20px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default SideBarLayout;
