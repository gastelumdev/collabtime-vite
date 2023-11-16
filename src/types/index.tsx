import { IconType } from "react-icons";

export type TProps = {
    workspaces: any;
    setWorkspaces: any;
};

export type TUserWorkspace = {
    id: string;
    permissions: number;
};

export type TUser = {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: number;
    workspaces: TUserWorkspace[];
};

export type TWorkspace = {
    _id?: string;
    name: string;
    description: string;
    tools: TTools;
    invitees: TInvitee[];
    members: TInvitee[];
    owner: string;
};

export type TInvitee = {
    email: string;
    permissions: number;
};

export type TReactSelectOptions = {
    value: string;
    label: string;
};

export type TWorkspaceUsers = {
    members: TUser[];
    invitees: TUser[];
    nonMembers: TUser[];
    reactSelectOptions: TReactSelectOptions[];
};

export type TJoinWorkspace = {
    workspaceId: string;
    userId: string;
};

export type TNotification = {
    message: string;
    workspaceId: string;
    createdAt: Date;
    dataSource: string;
    priority: string;
};

export type TDataCollection = {
    _id?: string;
    name: string;
    description: string;
    workspace: string;
    form: TForm;
    columns: string[];
    rows: string[];
};

export type TColumn = {
    _id?: string;
    dataCollectionId: string;
    name: string;
    type: string;
    permanent: boolean;
    people?: string[];
    labels?: TLabel[];
    includeInForm: boolean;
    includeInExport: boolean;
};

export type TRow = {
    _id?: string;
    dataCollectionId: string;
    cells: string[] | TCell;
};

export type TCell = {
    _id: string;
    dataCollection: string;
    row: string;
    name: string;
    type: string;
    people?: string[];
    labels?: TLabel[];
    value: string;
};

export type TLabel = {
    title: string;
    color: string;
};

export type TTableData = any;

export type TForm = {
    active: boolean;
    type: string;
    emails: string[];
};

export type TTools = {
    dataCollections: TAccess;
    taskLists: TAccess;
    docs: TAccess;
    messageBoard: TAccess;
};

export type TAccess = {
    access: number;
};

export interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}
