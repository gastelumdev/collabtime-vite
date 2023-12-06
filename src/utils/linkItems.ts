import { FaHome, FaTable, FaFileAlt, FaComments } from "react-icons/fa";
import { IconType } from "react-icons";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: FaHome, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: FaTable,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
    },
    {
        name: "Documents",
        icon: FaFileAlt,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
    },
    {
        name: "Message Board",
        icon: FaComments,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard`,
    },
];

export default LinkItems;