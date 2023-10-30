import { MenuButton, useDisclosure } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import DisplayList from "./DisplayList";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import { io } from "socket.io-client";
import { useEffect } from "react";

const View = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const socket = io("http://localhost:9000");

    useEffect(() => {
        socket.on("connection", () => console.log(socket.id));
    });

    socket.on("login", (item) => console.log(item.success));

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
