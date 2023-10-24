import { IconType } from "react-icons";

export type IProps = {
    workspaces: any;
    setWorkspaces: any;
};

export type IUser = {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    workspaces: string[];
};

export type IWorkspace = {
    _id: string;
    name: string;
    description: string;
    tools: ITools;
    invitees: IInvitee[];
};

export type IInvitee = {
    email: string;
    permissions: number;
};

export type IDataCollection = {
    _id?: string;
    name: string;
    workspace: string;
    form: IForm;
    columns: string[];
    rows: string[];
};

export type IForm = {
    active: boolean;
    type: string;
    emails: string[];
};

export type ITools = {
    dataCollections: IAccess;
    taskLists: IAccess;
    docs: IAccess;
    messageBoard: IAccess;
};

export type IAccess = {
    access: number;
};

export interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}
