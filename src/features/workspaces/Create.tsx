import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Space } from "antd";
import { Checkbox, Stack, Text } from "@chakra-ui/react";
import { IWorkspace } from "../../types";

let defaultValues: IWorkspace = {
    _id: "1",
    name: "",
    description: "",
    tools: {
        dataCollections: { access: 0 },
        taskLists: { access: 0 },
        docs: { access: 0 },
        messageBoard: { access: 0 },
    },
};

interface IProps {
    addNewWorkspace: any;
}

const Create = ({ addNewWorkspace }: IProps) => {
    const [checkedItems, setCheckedItems] = React.useState([
        true,
        true,
        true,
        true,
    ]);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<IWorkspace>(defaultValues);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const createData = async () => {
        const newWorkspace = onCheckboxChange();
        console.log(newWorkspace);
        addNewWorkspace(newWorkspace);
        setData(defaultValues);
        onClose();
        setData(defaultValues);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const onCheckboxChange = () => {
        let newWorkspace: IWorkspace = data;
        newWorkspace = {
            ...data,
            tools: {
                dataCollections: { access: checkedItems[0] ? 2 : 0 },
                taskLists: { access: checkedItems[1] ? 2 : 0 },
                docs: { access: checkedItems[2] ? 2 : 0 },
                messageBoard: { access: checkedItems[3] ? 2 : 0 },
            },
        };
        return newWorkspace;
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                New Workspace
            </Button>
            <Drawer
                title="Create a new workspace"
                width={500}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={createData}>
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
                <Text pb={"5px"}>Description</Text>
                <Input
                    name="description"
                    placeholder="please enter url description"
                    value={data.description}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Text pb={"5px"}>Tools</Text>
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
                </Stack>
            </Drawer>
        </>
    );
};

export default Create;
