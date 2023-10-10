"use client";
import View from "../features/notifications/View";
import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    Center,
    Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

// interface INavLinkProps {
//     children: React.ReactNode;
// }

interface INavProps {
    logo?: string;
    firstname?: string;
    lastname?: string;
}

// const NavLink = (props: INavLinkProps) => {
//     const { children } = props;

//     return (
//         <Box
//             as="a"
//             px={2}
//             py={1}
//             rounded={"md"}
//             _hover={{
//                 textDecoration: "none",
//                 bg: useColorModeValue("gray.200", "gray.700"),
//             }}
//             href={"#"}
//         >
//             {children}
//         </Box>
//     );
// };

export default function Nav({ logo, firstname, lastname }: INavProps) {
    const navigate = useNavigate();
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstname}%20${lastname}`;

    const logout = () => {
        navigate("/login");
    };
    return (
        <Box pb={3} bg={useColorModeValue("gray.50", "gray.800")}>
            <Box pl={"20px"} bg={"white"} boxShadow={"md"}>
                <Flex
                    h={16}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Box>
                        <Link to="/workspaces">
                            <Text as="b" color={"#3E505B"}>
                                {logo}
                            </Text>
                        </Link>
                    </Box>

                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={7}>
                            <Menu>
                                <View />
                            </Menu>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    style={{ backgroundColor: "white" }}
                                    cursor={"pointer"}
                                    minW={0}
                                >
                                    <Avatar size={"sm"} src={avatarUrl} />
                                </MenuButton>
                                <MenuList alignItems={"center"}>
                                    <br />
                                    <Center>
                                        <Avatar size={"lg"} src={avatarUrl} />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>{`${firstname} ${lastname}`}</p>
                                    </Center>
                                    <Center>
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                color: "gray",
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
                </Flex>
            </Box>
        </Box>
    );
}
