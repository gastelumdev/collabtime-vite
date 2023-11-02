import { MenuButton, useDisclosure } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import DisplayList from "./DisplayList";
import PrimaryDrawer from "../../components/PrimaryDrawer";

const View = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

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
