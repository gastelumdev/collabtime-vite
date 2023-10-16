import { useState } from "react";
import { Button, Drawer, Space } from "antd";
import { MenuButton } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import DisplayList from "./DisplayList";

const View = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <MenuButton bg={"#eff2f5"} onClick={showDrawer}>
                <BellIcon boxSize={5} color={"#7b809a"} />
            </MenuButton>
            <Drawer
                title="Notifications"
                width={720}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                }
            >
                <DisplayList />
            </Drawer>
        </>
    );
};

export default View;
