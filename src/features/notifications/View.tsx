import { MenuButton, useDisclosure } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import DisplayList from "./DisplayList";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import { io } from "socket.io-client";
import { useEffect } from "react";

const View = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const socket = io(import.meta.env.VITE_API_URL);

    useEffect(() => {
        socket.on("connection", () => console.log("Success"));
    });

    socket.on("con", (item) => console.log(item.message));

    return (
        <>
            <MenuButton bg={"#eff2f5"} onClick={onOpen}>
                <BellIcon boxSize={5} color={"#7b809a"} />
            </MenuButton>
            <PrimaryDrawer
                title="Notifications"
                isOpen={isOpen}
                onClose={onClose}
                size="lg"
            >
                <DisplayList />
            </PrimaryDrawer>
        </>
    );
};

export default View;
