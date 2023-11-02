/**
 * This file needs to be moved to ChakraUI
 * ***************************************
 */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Box, Center, HStack, Stack, Text } from "@chakra-ui/react";
import Divider from "../../components/Divider/Divider";

const data = [
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Critical",
    },
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Low",
    },
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Medium",
    },
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "High",
    },
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Low",
    },
    {
        message: "Task 1 was assigned to you by Carlos Torres",
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Medium",
    },
];

const priorityColors = ["gray", "#c91919", "#ff642a", "#ffcb00", "#34a640"];

const setPriorityColor = (priority: string) => {
    if (priority === "none") return priorityColors[0];
    if (priority === "Critical") return priorityColors[1];
    if (priority === "High") return priorityColors[2];
    if (priority === "Medium") return priorityColors[3];
    if (priority === "Low") return priorityColors[4];
};

const DisplayList = () => {
    const [notifications, setNotifications] = useState(data);
    const allData = data;
    const socket = io(import.meta.env.VITE_API_URL);

    useEffect(() => {
        socket.on("connection", () => console.log("Success"));

        socket.on("login", (item) => {
            console.log(item.message);
            let notificationsCopy = notifications;
            notificationsCopy.unshift(item);
            setNotifications(notificationsCopy);
            console.log(notifications);
        });

        console.log("Notifications updated");
    }, [notifications]);

    socket.on("con", (item) => console.log(item.message));

    const sortNotificationsBy = (priority: string) => {
        if (priority === "All") {
            setNotifications(allData);
            return;
        }
        let newData = data.filter((item) => {
            return item.priority === priority;
        });

        setNotifications(newData);
    };

    return (
        <>
            <HStack spacing={4}>
                <Box
                    w={"120px"}
                    bgColor={priorityColors[0]}
                    borderRadius={"base"}
                    p={"2px"}
                    cursor={"pointer"}
                    onClick={() => sortNotificationsBy("All")}
                >
                    <Center>
                        <Text color={"white"}>All</Text>
                    </Center>
                </Box>
                <Box
                    w={"120px"}
                    bgColor={priorityColors[1]}
                    borderRadius={"base"}
                    p={"2px"}
                    cursor={"pointer"}
                    onClick={() => sortNotificationsBy("Critical")}
                >
                    <Center>
                        <Text color={"white"}>Critical</Text>
                    </Center>
                </Box>
                <Box
                    w={"120px"}
                    bgColor={priorityColors[2]}
                    borderRadius={"base"}
                    p={"2px"}
                    cursor={"pointer"}
                    onClick={() => sortNotificationsBy("High")}
                >
                    <Center>
                        <Text color={"white"}>High</Text>
                    </Center>
                </Box>
                <Box
                    w={"120px"}
                    bgColor={priorityColors[3]}
                    borderRadius={"base"}
                    p={"2px"}
                    cursor={"pointer"}
                    onClick={() => sortNotificationsBy("Mid")}
                >
                    <Center>
                        <Text color={"white"}>Mid</Text>
                    </Center>
                </Box>
                <Box
                    w={"120px"}
                    bgColor={priorityColors[4]}
                    borderRadius={"base"}
                    p={"2px"}
                    cursor={"pointer"}
                    onClick={() => sortNotificationsBy("Low")}
                >
                    <Center>
                        <Text color={"white"}>Low</Text>
                    </Center>
                </Box>
            </HStack>
            <Stack mt={"30px"}>
                {notifications.map((item: any, index: number) => {
                    return (
                        <Box key={index}>
                            <Box>{item.message}</Box>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                            />
                        </Box>
                    );
                })}
            </Stack>
        </>
    );
};

export default DisplayList;
