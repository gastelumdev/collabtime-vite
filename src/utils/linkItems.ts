// import { FaHome, FaFileAlt, FaComments } from "react-icons/fa";
// import { HiMiniSquaresPlus } from "react-icons/hi2";
import { IconType } from "react-icons";
import { LiaCheckCircle, LiaCommentsSolid, LiaFolderOpen } from "react-icons/lia";

interface LinkItemProps {
    name: string;
    active?: boolean;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    // { name: "Workspaces", icon: LiaHomeSolid, path: "/workspaces" },
    { name: "Dashboard", icon: LiaCheckCircle, path: `/workspaces/${localStorage.getItem("workspaceId")}`, active: false },
    // {
    //     name: "Data Collections",
    //     icon: LiaThListSolid,
    //     path: ``,
    // },
    {
        name: "Documents",
        icon: LiaFolderOpen,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
        active: false,
    },
    {
        name: "Message Board",
        icon: LiaCommentsSolid,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard/active`,
        active: false
    },
];

export default LinkItems;