import { ReactNode } from "react";
import { useGetUserQuery } from "../../app/services/api";

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
    SimpleGrid,
    Hide,
    Spacer,
    Stack,
} from "@chakra-ui/react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { IconContext, IconType } from "react-icons";
import Divider from "../Divider/Divider";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import View from "../../features/notifications/View";
import logo from "../../assets/logo-no-background.png";

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
    onClose: () => void;
}

interface SidebarContentProps {
    sidebar?: boolean;
    linkItems: LinkItemProps[];
    leftContent?: any;
    children: ReactNode;
}

const SidebarContent = ({ linkItems, onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            borderRight="px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Box bg={"black"} h={"94%"} borderRadius={"xl"}>
                <Box
                    pt={"20px"}
                    bgImage={"radial-gradient(circle at center top, rgb(66, 66, 74), black)"}
                    height={"full"}
                    borderRadius={"xl"}
                >
                    <Box pt={"6px"} pb={"4px"}>
                        <Center>
                            <Text as={"b"} fontSize={"16px"} color={"white"}>
                                {/* <LikeOutlined
                                    style={{
                                        marginRight: "4px",
                                        fontSize: "20px",
                                    }}
                                /> */}
                                <img src={logo} width={"80px"} />
                            </Text>
                        </Center>
                    </Box>
                    <Divider gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)" marginBottom="10px" />
                    <Box transition="3s ease">
                        {linkItems.map((link) => (
                            <Link to={link.path} key={link.name}>
                                <NavItem key={link.name} icon={link.icon}>
                                    <Text color={"white"}>{link.name}</Text>
                                </NavItem>
                            </Link>
                        ))}
                        <Divider gradient="radial-gradient(#5e5b5b 40%, black)" marginBottom="10px" marginTop="10px" />
                        <Link to={"/login"}>
                            <NavItem icon={FiLogOut}>
                                <Text color={"white"}>Logout</Text>
                            </NavItem>
                        </Link>
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
            _hover={{
                bgImage: "linear(195deg, rgb(73, 163, 241), rgb(26, 115, 232))",
                color: "white",
            }}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: "white",
                    }}
                    as={icon}
                    color={"white"}
                />
            )}
            {children}
        </Flex>
    );
};

const TopNav = ({ sidebar = true, onOpen, leftContent, ...rest }: TopNavProps) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };
    const { data } = useGetUserQuery(localStorage.getItem("userId") as string);

    return (
        <Flex
            ml={{ base: 0, lg: sidebar ? "400px" : "0" }}
            pl={{ base: 0, lg: 0 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.900")}
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <Container maxW={"8xl"} mt={{ base: 0 }}>
                <Box pb={3} bg={"#eff2f5"}>
                    <Box bg={"#eff2f5"}>
                        <SimpleGrid columns={[1, 2, 2]} spacingY={{ sm: 3 }}>
                            <Flex alignItems={"center"} justifyContent={"space-between"}>
                                <IconButton
                                    display={{ base: "flex", lg: "none" }}
                                    onClick={onOpen}
                                    variant="outline"
                                    aria-label="open menu"
                                    icon={<FiMenu />}
                                />
                                <Box
                                    ml={{ base: 3, lg: 0 }}
                                    // pt={"18px"}
                                    bg={"#eff2f5"}
                                >
                                    {leftContent}
                                </Box>
                                <Spacer />
                            </Flex>
                            <Flex>
                                <Hide below="sm">
                                    <Spacer />
                                </Hide>

                                <Stack direction={"row"} spacing={6}>
                                    <Menu>
                                        <View />
                                    </Menu>
                                    <Menu autoSelect={false}>
                                        <MenuButton
                                            style={{
                                                backgroundColor: "#eff2f5",
                                            }}
                                        >
                                            <Text size={"20px"} pt={1}>
                                                <IconContext.Provider
                                                    value={{
                                                        size: "18px",
                                                        color: "#7b809a",
                                                    }}
                                                >
                                                    <FaUserCircle />
                                                </IconContext.Provider>
                                            </Text>
                                        </MenuButton>
                                        <MenuList alignItems={"center"} zIndex={"10"}>
                                            <br />
                                            <Center>
                                                <Avatar
                                                    size={"lg"}
                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${data?.firstname}%20${data?.lastname}`}
                                                />
                                            </Center>
                                            <br />
                                            <Center>
                                                <p>{`${data?.firstname} ${data?.lastname}`}</p>
                                            </Center>
                                            <Center>
                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "gray",
                                                    }}
                                                >
                                                    {data?.email}
                                                </p>
                                            </Center>
                                            <br />
                                            <MenuDivider />
                                            <MenuItem
                                                color={"#7b809a"}
                                                onClick={() => navigate("/resetPasswordRequest")}
                                            >
                                                Reset Password
                                            </MenuItem>
                                            <MenuItem onClick={logout} color={"#7b809a"}>
                                                Logout
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Stack>
                            </Flex>
                        </SimpleGrid>
                    </Box>
                </Box>
            </Container>
            {/* </Flex> */}
        </Flex>
    );
};

const SideBarLayout = ({ linkItems, leftContent, sidebar = true, children }: SidebarContentProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    console.log(sidebar);

    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")} pl={{ base: 0, lg: 6 }} pr={0} pt={6}>
            {sidebar ? (
                <SidebarContent linkItems={linkItems} onClose={() => onClose} display={{ base: "none", lg: "block" }} />
            ) : null}
            <Box mx={"6px"} ml={"6px"}>
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="xs"
                >
                    <DrawerContent>
                        <Box py={6} pl={6} height={"full"} bg={useColorModeValue("gray.100", "gray.900")}>
                            <Box
                                pt={"20px"}
                                bgImage={"radial-gradient(circle at center top, rgb(66, 66, 74), black)"}
                                height={"full"}
                                borderRadius={"xl"}
                            >
                                <Box pt={"6px"} pb={"4px"}>
                                    <Center>
                                        <Text as={"b"} fontSize={"16px"} color={"white"}>
                                            {/* <LikeOutlined
                                                style={{
                                                    marginRight: "4px",
                                                    fontSize: "20px",
                                                }}
                                            /> */}
                                            <img src={logo} width={"80px"} />
                                        </Text>
                                    </Center>
                                </Box>
                                <Divider gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)" marginBottom="10px" />
                                <Box transition="3s ease">
                                    {linkItems.map((link) => (
                                        <Link to={link.path} key={link.name}>
                                            <NavItem key={link.name} icon={link.icon}>
                                                <Text color={"#dbdbdb"}>{link.name}</Text>
                                            </NavItem>
                                        </Link>
                                    ))}
                                    <Divider
                                        gradient="radial-gradient(#5e5b5b 40%, black)"
                                        marginBottom="10px"
                                        marginTop="10px"
                                    />
                                    <Link to={"/login"}>
                                        <NavItem icon={FiLogOut}>
                                            <Text color={"#dbdbdb"}>Logout</Text>
                                        </NavItem>
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </DrawerContent>
                </Drawer>
            </Box>
            {/* mobilenav */}
            <Box ml={{ base: 0, lg: sidebar ? "240px" : "0" }} p={{ base: 0 }}>
                <TopNav sidebar={false} onOpen={onOpen} leftContent={leftContent} />
            </Box>
            <Box
                ml={{ base: 0, lg: sidebar ? "240px" : "0" }}
                p={{ base: 0 }}
                pt={{
                    base: sidebar ? "0px" : "50px",
                    lg: sidebar ? "0px" : "50px",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default SideBarLayout;
