import React, { useState } from "react";
import { Drawer, Input, Space } from "antd";
import { Button, Text } from "@chakra-ui/react";
import { TDataCollection } from "../../types";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

let defaultValues: TDataCollection = {
    name: "",
    description: "",
    workspace: "",
    template: "default",
    form: {
        active: false,
        type: "null",
        emails: [],
    },
    columns: [],
    rows: [],
    tags: [],
};

interface IProps {
    dataCollection: TDataCollection;
    updateDataCollection: any;
}

const AddForm = ({ dataCollection, updateDataCollection }: IProps) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<TDataCollection>(dataCollection);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const updateData = async () => {
        const newDataCollection = data;
        console.log(newDataCollection);
        updateDataCollection(newDataCollection);
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
            {/* <Button
                colorScheme="twitter"
                onClick={showDrawer}
                _hover={{
                    boxShadow: "lg",
                }}
                bgGradient="linear(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
                boxShadow={"md"}
            >
                New Workspace
            </Button> */}
            <PrimaryButton onClick={showDrawer}>ADD FORM</PrimaryButton>
            <Drawer
                title="Create a new workspace"
                width={500}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={updateData} _hover={{ boxShadow: "lg" }}>
                            Save
                        </Button>
                    </Space>
                }
            >
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    placeholder="Please enter workspace name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                {/* <Text pb={"5px"}>Description</Text>
                <Input
                    name="description"
                    placeholder="please enter url description"
                    value={data.description}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                /> */}
                {/* <Text pb={"5px"}>Tools</Text>
                <Stack mt={1} spacing={1}>
                    <Checkbox
                        isChecked={checkedItems[0]}
                        onChange={(e) =>
                            setCheckedItems([
                                e.target.checked,
                                checkedItems[1],
                                checkedItems[2],
                                checkedItems[3],
                            ])
                        }
                    >
                        <Text fontSize={"14px"}>Data Collections</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[1]}
                        onChange={(e) =>
                            setCheckedItems([
                                checkedItems[0],
                                e.target.checked,
                                checkedItems[2],
                                checkedItems[3],
                            ])
                        }
                    >
                        <Text fontSize={"14px"}>Tasks</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[2]}
                        onChange={(e) =>
                            setCheckedItems([
                                checkedItems[0],
                                checkedItems[1],
                                e.target.checked,
                                checkedItems[3],
                            ])
                        }
                    >
                        <Text fontSize={"14px"}>Docs</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[3]}
                        onChange={(e) =>
                            setCheckedItems([
                                checkedItems[0],
                                checkedItems[1],
                                checkedItems[2],
                                e.target.checked,
                            ])
                        }
                    >
                        <Text fontSize={"14px"}>Message Board</Text>
                    </Checkbox>
                </Stack> */}
            </Drawer>
        </>
    );
};

export default AddForm;
