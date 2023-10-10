import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Space } from "antd";
import { Text, Checkbox, Stack } from "@chakra-ui/react";
import { IWorkspace } from "../../types";

interface IProps {
    workspace: IWorkspace;
    updateWorkspace: any;
}

const Edit = ({ workspace, updateWorkspace }: IProps) => {
    const [checkedItems, setCheckedItems] = React.useState([
        workspace.tools.dataCollections.access > 0 ? true : false,
        workspace.tools.taskLists.access > 0 ? true : false,
        workspace.tools.docs.access > 0 ? true : false,
        workspace.tools.messageBoard.access > 0 ? true : false,
    ]);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<IWorkspace>(workspace);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const editData = async () => {
        onCheckboxChange();
        updateWorkspace(data);
        onClose();
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
        setData(newWorkspace);
    };

    return (
        <>
            <EditOutlined key="edit" onClick={showDrawer} />
            <Drawer
                title="Create a new workspace"
                width={720}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={editData}>
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    value={data.name}
                    placeholder="Please enter user name"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Text pb={"5px"}>Description</Text>
                <Input
                    name="description"
                    value={data.description}
                    placeholder="please enter url description"
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

export default Edit;
