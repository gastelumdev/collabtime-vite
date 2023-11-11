import React, { useState } from "react";
import { Drawer, Input, Space } from "antd";
import { Button, Text } from "@chakra-ui/react";
import { TDataCollection } from "../../types";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

let defaultValues: TDataCollection = {
    name: "",
    description: "",
    workspace: "",
    form: {
        active: false,
        type: "null",
        emails: [],
    },
    columns: [],
    rows: [],
};

interface IProps {
    addNewDataCollection: any;
}

const Create = ({ addNewDataCollection }: IProps) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<TDataCollection>(defaultValues);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const createData = async () => {
        const newDataCollection = data;
        console.log(newDataCollection);
        addNewDataCollection(newDataCollection);
        setData(defaultValues);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <>
            <PrimaryButton onClick={showDrawer}>NEW COLLECTION</PrimaryButton>
            <Drawer
                title="Create a new data collection"
                width={500}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={createData}
                            _hover={{ boxShadow: "lg" }}
                        >
                            Save
                        </Button>
                    </Space>
                }
            >
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    placeholder="Please enter user name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
            </Drawer>
        </>
    );
};

export default Create;
