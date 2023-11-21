/**
 * This file needs to be moved to ChakraUI
 * ***************************************
 */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Box, Center, Flex, HStack, Spacer, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { useGetNotificationsQuery, useCallNotificationsUpdateMutation } from "../../app/services/api";

// const data = [
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "Critical",
//     },
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "Low",
//     },
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "Medium",
//     },
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "High",
//     },
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "Low",
//     },
//     {
//         message: "Task 1 was assigned to you by Carlos Torres",
//         created_on: "10/06/2023",
//         data_source: "List 1",
//         priority: "Medium",
//     },
// ];

// const setPriorityColor = (priority: string) => {
//     if (priority === "none") return priorityColors[0];
//     if (priority === "Critical") return priorityColors[1];
//     if (priority === "High") return priorityColors[2];
//     if (priority === "Medium") return priorityColors[3];
//     if (priority === "Low") return priorityColors[4];
// };

const DisplayList = () => {
    const { data, isLoading, isError, error } = useGetNotificationsQuery(null);
    const [callNotificationsUpdate] = useCallNotificationsUpdateMutation();
    // const [allData] = useState(data);
    const [priority] = useState("All");
    const [activeTab, setActiveTab] = useState(0);
    const toast = useToast();

    const priorityButtonWidth = "110px";
    const priorityButtonBoxShadow = "inner";

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on("update", () => {
            console.log("Notifications called for update");
            callNotificationsUpdate(priority);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log(priority);
        setNotificationsFilter(localStorage.getItem("notificationsFilter") as string, 0);
    }, [priority]);

    const setNotificationsFilter = (priority: string, index: number) => {
        setActiveTab(index);
        localStorage.setItem("notificationsFilter", priority);
        callNotificationsUpdate(priority);
    };

    const formatHours = (hours: any) => {
        if (hours > 12) {
            return hours - 12;
        }
        return hours;
    };

    const getMeridian = (hours: any) => {
        if (hours > 12) {
            return "PM";
        }
        return "AM";
    };

    const formatTime = (date: Date) => {
        let newDate = new Date(date);
        let formattedDate = `${newDate.getMonth()}/${newDate.getDay()}/${newDate.getFullYear()} ${formatHours(
            newDate.getHours()
        )}:${newDate.getUTCMinutes() > 9 ? "" : "0"}${newDate.getUTCMinutes()} ${getMeridian(newDate.getHours())}`;
        return (
            <Text fontSize={"12px"} color={"#7b809a"}>
                {formattedDate}
            </Text>
        );
    };

    const setPriorityColor = (priority: string) => {
        if (priority === "All")
            return {
                active: "#36B2DC",
                inactive: "#add8e6",
            };
        if (priority === "Low")
            return {
                active: "#3BE23B",
                inactive: "lightgreen",
                bg: "#F2FFF2",
            };
        if (priority === "Mid")
            return {
                active: "#FFD30E",
                inactive: "#FFE77A",
            };
        if (priority === "High")
            return {
                active: "#ffa507",
                inactive: "#FFC37A",
            };
        if (priority === "Critical")
            return {
                active: "#ff0300",
                inactive: "#fec0cb",
            };
    };

    if (isError) {
        console.log(error);
        toast({
            title: "Error",
            description: "There was an error loading notifications",
            status: "error",
        });
    }

    return (
        <>
            <Box position={"relative"}>
                <Box position={"fixed"} left={4} top={"70px"}>
                    <HStack spacing={4}>
                        <Box
                            w={priorityButtonWidth}
                            bg={activeTab === 0 ? setPriorityColor("All")?.active : setPriorityColor("All")?.inactive}
                            borderRadius={"base"}
                            boxShadow={activeTab === 0 ? priorityButtonBoxShadow : "none"}
                            p={"2px"}
                            cursor={"pointer"}
                            onClick={() => setNotificationsFilter("All", 0)}
                        >
                            <Center>
                                <Text color={"white"}>All</Text>
                            </Center>
                        </Box>
                        <Box
                            w={priorityButtonWidth}
                            bg={
                                activeTab === 1
                                    ? setPriorityColor("Critical")?.active
                                    : setPriorityColor("Critical")?.inactive
                            }
                            borderRadius={"base"}
                            boxShadow={activeTab === 1 ? priorityButtonBoxShadow : "none"}
                            p={"2px"}
                            cursor={"pointer"}
                            onClick={() => setNotificationsFilter("Critical", 1)}
                        >
                            <Center>
                                <Text color={"white"}>Critical</Text>
                            </Center>
                        </Box>
                        <Box
                            w={priorityButtonWidth}
                            bg={activeTab === 2 ? setPriorityColor("High")?.active : setPriorityColor("High")?.inactive}
                            borderRadius={"base"}
                            boxShadow={activeTab === 2 ? priorityButtonBoxShadow : "none"}
                            p={"2px"}
                            cursor={"pointer"}
                            onClick={() => setNotificationsFilter("High", 2)}
                        >
                            <Center>
                                <Text color={"white"}>High</Text>
                            </Center>
                        </Box>
                        <Box
                            w={priorityButtonWidth}
                            bg={activeTab === 3 ? setPriorityColor("Mid")?.active : setPriorityColor("Mid")?.inactive}
                            borderRadius={"base"}
                            boxShadow={activeTab === 3 ? priorityButtonBoxShadow : "none"}
                            p={"2px"}
                            cursor={"pointer"}
                            onClick={() => setNotificationsFilter("Mid", 3)}
                        >
                            <Center>
                                <Text color={"white"}>Mid</Text>
                            </Center>
                        </Box>
                        <Box
                            w={priorityButtonWidth}
                            bg={activeTab === 4 ? setPriorityColor("Low")?.active : setPriorityColor("Low")?.inactive}
                            borderRadius={"base"}
                            boxShadow={activeTab === 4 ? priorityButtonBoxShadow : "none"}
                            p={"2px"}
                            cursor={"pointer"}
                            onClick={() => setNotificationsFilter("Low", 4)}
                        >
                            <Center>
                                <Text color={"white"}>Low</Text>
                            </Center>
                        </Box>
                    </HStack>
                </Box>
            </Box>

            <Stack mt={"30px"}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    data?.map((item: any, index: number) => {
                        return (
                            <Box key={index}>
                                <Box
                                    p={"10px"}
                                    pb={"40px"}
                                    mb={"8px"}
                                    // bg={setPriorityColor(item.priority)?.bg}
                                    borderTop={"1px"}
                                    borderTopColor={"#edf2f7"}
                                    borderBottom={"1px"}
                                    borderBottomColor={setPriorityColor(item.priority)?.active}
                                    boxShadow={"md"}
                                >
                                    <Flex>
                                        <Text color={"#7b809a"} fontSize={"14px"}>
                                            {item.message}
                                        </Text>
                                        <Spacer />
                                        {formatTime(item.createdAt)}
                                    </Flex>
                                </Box>
                                {/* <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                            /> */}
                            </Box>
                        );
                    })
                )}
            </Stack>
        </>
    );
};

export default DisplayList;
