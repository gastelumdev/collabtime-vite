import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import { ReactNode } from "react";
import Divider from "../Divider/Divider";

interface PrimaryDrawerProps {
    isOpen: boolean;
    onClose: any;
    title: string;
    size?: string;
    initialFocusRef?: any;
    children: ReactNode;
}

const PrimaryDrawer = ({ isOpen, onClose, title, size = "md", initialFocusRef, children }: PrimaryDrawerProps) => {
    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={size} initialFocusRef={initialFocusRef}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton onClick={onClose} />
                <DrawerHeader fontSize={"16px"}>
                    {title}
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" />
                </DrawerHeader>
                <DrawerBody>{children}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default PrimaryDrawer;
