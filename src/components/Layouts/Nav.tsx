"use client";
import { LikeOutlined } from "@ant-design/icons";

import { Box, Flex, Center, Text, FlexProps, Icon } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { Layout } from "antd";
// import type { MenuProps } from "antd";
import { Link } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { ReactNode, useState } from "react";
import { IconType } from "react-icons";
import Divider from "../Divider/Divider";
import { FaTasks } from "react-icons/fa";
import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { BiTable } from "react-icons/bi";

// interface INavLinkProps {
//     children: React.ReactNode;
// }

interface INavProps {
    logo?: string;
    firstname?: string;
    lastname?: string;
    setWidth: (width: string) => void;
    children?: ReactNode;
}

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
}

// type MenuItem = Required<MenuProps>["items"][number];

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: BiTable,
        path: "/workspaces/1/dataCollections",
    },
    { name: "Tasks", icon: FaTasks, path: "" },
    { name: "Documents", icon: BsFiletypeDoc, path: "" },
    { name: "Message Board", icon: AiOutlineMessage, path: "" },
];

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="4"
                pl={12}
                // mx="4"
                // borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "#3182ce",
                    color: "white",
                    // borderBottom: "6px solid white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="24"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    );
};

export default function Nav({ setWidth }: INavProps) {
    const [navWidth, setNavWidth] = useState("270px");

    console.log(navWidth);

    return (
        <>
            <Layout>
                <Sider
                    width={"250px"}
                    breakpoint="lg"
                    collapsedWidth="0"
                    trigger={null}
                    onBreakpoint={(broken) => {
                        if (broken) {
                            setNavWidth("0px");
                            setWidth("0px");
                        } else {
                            setNavWidth("270px");
                            setWidth("270px");
                        }
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    style={{
                        borderRadius: "10px",
                        backgroundImage:
                            "radial-gradient(circle at center top, rgb(66, 66, 74), black)",
                        position: "fixed",
                        height: "98%",
                        zIndex: "10",
                    }}
                >
                    <Box pt={"20px"}>
                        <Box color={"white"} pt={"6px"} pb={"4px"}>
                            <Center>
                                <Text as={"b"} fontSize={"16px"}>
                                    <LikeOutlined
                                        style={{
                                            marginRight: "4px",
                                            fontSize: "20px",
                                        }}
                                    />
                                    Collabtime
                                </Text>
                            </Center>
                        </Box>
                        <Divider
                            gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)"
                            marginBottom="10px"
                        />
                        <Box transition="3s ease" color={"white"}>
                            {LinkItems.map((link) => (
                                <Link to={link.path}>
                                    <NavItem key={link.name} icon={link.icon}>
                                        <Text color={"#dbdbdb"}>
                                            {link.name}
                                        </Text>
                                    </NavItem>
                                </Link>
                            ))}
                            <Divider
                                gradient="radial-gradient(#5e5b5b 40%, #1c1c1c)"
                                marginBottom="10px"
                                marginTop="10px"
                            />
                            <NavItem icon={FiLogOut}>
                                <Text color={"#dbdbdb"}>Logout</Text>
                            </NavItem>
                        </Box>
                    </Box>
                </Sider>
            </Layout>
        </>
    );
}
