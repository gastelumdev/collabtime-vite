import { useState } from "react";
import { Avatar, Badge, List, Space, Tag } from "antd";

const data = [
    {
        sender: "Carlos Torres",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Critical",
    },
    {
        sender: "Rick Ruiz",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Low",
    },
    {
        sender: "Carlos Torres",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Medium",
    },
    {
        sender: "Carlos Torres",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "High",
    },
    {
        sender: "Rick Ruiz",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Low",
    },
    {
        sender: "Carlos Torres",
        assigned_to: "Omar Gastelum",
        type: "Assigned",
        title: `Task 1`,
        created_on: "10/06/2023",
        data_source: "List 1",
        priority: "Medium",
    },
];

const setPriorityColor = (priority: string) => {
    if (priority === "Critical") return "#c91919";
    if (priority === "High") return "#ff642a";
    if (priority === "Medium") return "#ffcb00";
    if (priority === "Low") return "#34a640";
};

// const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
//     <Space>
//         {React.createElement(icon)}
//         {text}
//     </Space>
// );

const DisplayList = () => {
    const [notifications, setNotifications] = useState(data);
    const allData = data;

    const sortNotificationsBy = (priority: string) => {
        if (priority === "All") {
            setNotifications(allData);
            return;
        }
        let newData = data.filter((item) => {
            return item.priority === priority;
        });

        setNotifications(newData);
    };

    return (
        <>
            <Space style={{ marginBottom: "25px" }} size={[0, 8]} wrap>
                <Tag
                    style={{ width: "100px", textAlign: "center" }}
                    color="gray"
                    onClick={() => sortNotificationsBy("All")}
                >
                    All
                </Tag>
                <Tag
                    style={{ width: "100px", textAlign: "center" }}
                    color="#34a640"
                    onClick={() => sortNotificationsBy("Low")}
                >
                    Low Priority
                </Tag>
                <Tag
                    style={{ width: "100px", textAlign: "center" }}
                    color="#ffcb00"
                    onClick={() => sortNotificationsBy("Medium")}
                >
                    Medium Priority
                </Tag>
                <Tag
                    style={{ width: "100px", textAlign: "center" }}
                    color="#ff642a"
                    onClick={() => sortNotificationsBy("High")}
                >
                    High Priority
                </Tag>
                <Tag
                    style={{ width: "100px", textAlign: "center" }}
                    color="#c91919"
                    onClick={() => sortNotificationsBy("Critical")}
                >
                    Critical Priority
                </Tag>
            </Space>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 5,
                }}
                dataSource={notifications}
                renderItem={(item) => (
                    <Badge.Ribbon
                        text={item.priority}
                        color={setPriorityColor(item.priority)}
                        style={{ width: "70px", textAlign: "center" }}
                    >
                        <List.Item
                            key={item.title}
                            // actions={[
                            //     <IconText
                            //         icon={StarOutlined}
                            //         text="156"
                            //         key="list-vertical-star-o"
                            //     />,
                            //     <IconText
                            //         icon={LikeOutlined}
                            //         text="156"
                            //         key="list-vertical-like-o"
                            //     />,
                            //     <IconText
                            //         icon={MessageOutlined}
                            //         text="2"
                            //         key="list-vertical-message"
                            //     />,
                            // ]}
                            // extra={
                            //     <img
                            //         width={272}
                            //         alt="logo"
                            //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            //     />
                            // }
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.sender}`}
                                    />
                                }
                                title={`${item.title} was assigned to you by ${item.sender}`}
                                // description={item.description}
                            />
                            <span
                                style={{ color: "gray", fontSize: "13px" }}
                            >{`${item.created_on} - ${item.data_source}`}</span>
                        </List.Item>
                    </Badge.Ribbon>
                )}
            />
        </>
    );
};

export default DisplayList;
