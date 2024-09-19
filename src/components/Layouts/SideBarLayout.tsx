import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useCreateWorkspaceMutation, useGetOneWorkspaceQuery, useGetUserQuery, useGetWorkspacesQuery, useUpdateUserMutation } from '../../app/services/api';

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
    Spacer,
    Stack,
    useToast,
    // Tooltip,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';

import { IconType } from 'react-icons';
// import Divider from '../Divider/Divider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LiaSignOutAltSolid, LiaUserSolid } from 'react-icons/lia';
import View from '../../features/notifications/View';
import Search from '../../features/search/View';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Create from '../../features/workspaces/Create';
import { bgColor, color, topNavBgColor, hoverBg } from '../../utils/colors';

interface LinkItemProps {
    name: string;
    active?: boolean;
    icon: IconType;
    path: string;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    active?: boolean;
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

interface NavItemSubHeaderProps {
    title: string;
    description: string;
}

const SidebarContent = ({ linkItems, onClose, isOpen, ...rest }: SidebarProps) => {
    const { id } = useParams();
    const { data: workspace } = useGetOneWorkspaceQuery(id as any);
    const { data } = useGetWorkspacesQuery(null);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') as string);
    const [createWorkspace, { isError: createWorkspaceIsError, error: createWorkspaceError }] = useCreateWorkspaceMutation();
    const [updateUser] = useUpdateUserMutation();
    const height = window.innerHeight;
    const [sidebarHeight, setSidebarHeight] = useState(height);

    const toast = useToast();

    const resizeSidebar = useCallback(() => {
        setSidebarHeight(window.innerHeight);
    }, [sidebarHeight]);

    useEffect(() => {
        window.addEventListener('resize', resizeSidebar);

        return () => {
            window.removeEventListener('resize', resizeSidebar);
        };
    }, []);

    if (createWorkspaceIsError) {
        toast({
            title: 'Create Workspace Error',
            description: (createWorkspaceError as any)?.data.error._message,
            status: 'error',
        });
    }

    return (
        <Box
            transition="3s ease"
            borderRight="px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: '260px' }}
            pos="fixed"
            h={'100%'}
            p={'0'}
            {...rest}
        >
            <Box bg={'black'} h={height}>
                <Box pt={'14px'} bgColor={bgColor} height={'full'}>
                    <Box pb={'4px'}>
                        <Center>
                            <Text as={'b'} fontSize={'20px'} color={'white'}>
                                Collabtime
                            </Text>
                        </Center>
                    </Box>
                    <Box>
                        <Box px={'24px'}>
                            <NavItemSubHeader title={'Workspaces'} description={'Choose Workspace from dropdown'} />
                            <Box pt={'8px'}>
                                <Menu>
                                    <MenuButton
                                        color={color}
                                        w={'100%'}
                                        border={'1px solid ' + color}
                                        borderRadius={'5px'}
                                        fontSize={'14px'}
                                        fontWeight={'semibold'}
                                        py={'5px'}
                                    >
                                        <Text color={'white'}>
                                            {workspace?.name || '|'} <ChevronDownIcon fontSize={'20px'} />
                                        </Text>
                                    </MenuButton>
                                    <MenuList>
                                        {data?.map((ws: any, index: number) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    as={'a'}
                                                    href={`/workspaces/${ws._id}`}
                                                    onClick={() => {
                                                        localStorage.setItem('workspaceId', ws._id);
                                                        updateUser({ ...user, defaultWorkspaceId: ws._id });
                                                    }}
                                                    fontSize={'14px'}
                                                    color={bgColor}
                                                >
                                                    {ws.name}
                                                </MenuItem>
                                            );
                                        })}
                                        <MenuDivider />
                                        {/* <MenuItem
                                            as={'a'}
                                            icon={<AddIcon />}
                                            fontSize={'14px'}
                                            color={bgColor}
                                            cursor={'pointer'}
                                            onClick={() => {
                                                console.log('Menu item clicked');
                                            }}
                                        > */}
                                        <Create addNewWorkspace={createWorkspace} workspaces={data} />
                                        {/* </MenuItem> */}
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Box>
                        <Box transition="3s ease">
                            <Box px={'24px'}>
                                <NavItemSubHeader title={'Dashboards'} description="Data Collection Views" />
                            </Box>
                            {linkItems.map((_link, index) => {
                                console.log(linkItems);
                                return (
                                    <Box key={index}>
                                        {/* <Link to={link.path}>
                                            <NavItem key={link.name} icon={link.icon} active={link.active}>
                                                {link.name}
                                            </NavItem>
                                        </Link> */}
                                    </Box>
                                );
                            })}
                            <Link to={'/login'}>
                                <NavItem icon={LiaSignOutAltSolid}>Logout</NavItem>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const NavItemSubHeader = ({ title, description }: NavItemSubHeaderProps) => {
    return (
        <Box mb={'10px'} mt={'50px'}>
            <Text color={'#24A2F0'} fontSize={'12px'} fontWeight={'semibold'}>
                {title.toUpperCase()}
            </Text>
            <Text color={'#797E89'} fontSize={'11px'} fontWeight={'semibold'}>
                {description}
            </Text>
        </Box>
    );
};

const NavItem = ({ icon, active = false, children, ...rest }: NavItemProps) => {
    return (
        <Flex
            align="center"
            py="2"
            my="2"
            mx="2"
            px="14px"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={active ? 'white' : color}
            _hover={{
                bgColor: hoverBg,
                color: 'white',
            }}
            bgColor={active ? hoverBg : 'inherit'}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="5"
                    fontSize="24"
                    // _groupHover={{
                    //     color: '#24a2f0',
                    // }}
                    as={icon}
                    // color={'#c6c2d9'}
                />
            )}
            <Text fontSize={'14px'} fontWeight={'semibold'}>
                {children}
            </Text>
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
        <Box px={'15px'} {...rest}>
            <Flex>
                <IconButton
                    display={{ base: 'flex', lg: 'none' }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu />}
                    color={'white'}
                    bgColor={topNavBgColor}
                />
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
                                backgroundColor: topNavBgColor,
                            }}
                        >
                            <Text size={'20px'} pt={1} color={'white'} fontSize={'22px'}>
                                <LiaUserSolid />
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
                            <MenuItem color={color} onClick={() => navigate('/resetPasswordRequest')}>
                                Reset Password
                            </MenuItem>
                            <MenuItem onClick={logout} color={color}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Stack>
            </Flex>
        </Box>
    );
};

const SideBarLayout = ({ linkItems, leftContent, sidebar = true, children }: SidebarContentProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg={"useColorModeValue('gray.100', 'gray.900')"} pl={{ base: 0, lg: 0 }} pr={0} pt={0}>
            {sidebar ? <SidebarContent linkItems={linkItems} onClose={onClose} isOpen={isOpen} display={{ base: 'none', lg: 'block' }} /> : null}
            <Box mx={'6px'} ml={'6px'} h={'full'}>
                <Drawer isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="xs">
                    <DrawerContent boxShadow={'none'}>
                        <SidebarContent linkItems={linkItems} onClose={onClose} isOpen={isOpen} />
                    </DrawerContent>
                </Drawer>
            </Box>
            <Box ml={{ base: 0, lg: sidebar ? '260px' : '0' }} p={{ base: 0 }} h={'60px'} bgColor={topNavBgColor} pt={'2'}>
                <TopNav sidebar={false} onOpen={onOpen} leftContent={leftContent} />
            </Box>
            <Box
                ml={{ base: 0, lg: sidebar ? '260px' : '0' }}
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
