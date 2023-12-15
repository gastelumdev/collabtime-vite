import { FaHome, FaTable, FaFileAlt, FaComments } from "react-icons/fa";
import { HiMiniSquaresPlus } from "react-icons/hi2";
import { IconType } from "react-icons";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: FaHome, path: "/workspaces" },
    { name: "Features", icon: HiMiniSquaresPlus, path: `/workspaces/${localStorage.getItem("workspaceId")}`},
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
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard/active`,
    },
];

export default LinkItems;