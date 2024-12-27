import { IconType } from 'react-icons';

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
    organization: string;
    logoURL: string;
    workspaces: TUserWorkspace[];
    defaultWorkspaceId: string;
};

export type TWorkspace = {
    _id?: string;
    name: string;
    description: string;
    tools: TTools;
    invitees: TInvitee[];
    members: TInvitee[];
    owner: string;
    tags: TTag[];
    workspaceTags: TTag[];
    type: 'basic' | 'resource planning' | 'integration';
    settings: IWorkspaceSettings | null;
};

export interface IWorkspaceSettings {
    integration: { swiftSensors: IIntegrationSettings };
}

export interface IIntegrationSettings {
    type: 'Swift Sensors';
    apiKey: string;
    email: string;
    password: string;
    accessToken: string | null;
    expiresIn: number | null;
    tokenType: string | null;
    refreshToken: string | null;
    sessionId: string | null;
    accountId: string | null;
    dataCollectionId: string | null;
    active: boolean;
}

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
    assignedTo: string;
    createdAt: Date;
    dataSource: string;
    priority: string;
};

export type TDataCollection = {
    _id?: string;
    name: string;
    description: string;
    workspace: string;
    row?: string;
    template: string;
    form: TForm;
    columns: string[];
    primaryColumnName?: string;
    rows: string[];
    tags: TTag[];
    asTemplate?: { active: boolean; name: string };
    formRecipients?: { sent: true; email: string }[];
    autoIncremented?: boolean;
    autoIncrementPrefix?: string;
    belongsToAppModel?: boolean;
    main?: boolean;
    appModel?: string | null;
    inParentToDisplay?: string | null;
    filters?: any;
    appType?: string | null;
    userGroupAccess?: string[];
};

export type TColumn = {
    _id?: string;
    dataCollection: string;
    name: string;
    type: string;
    permanent: boolean;
    people?: TUser[];
    labels?: TLabel[];
    dataCollectionRef: any;
    dataCollectionRefLabel?: any;
    includeInForm: boolean;
    includeInExport: boolean;
    position: number;
    width?: string;
    autoIncremented?: boolean;
    autoIncrementPrefix?: string;
};

export interface INote {
    content: string;
    owner: string;
    createdAt: string;
    read: boolean;
    people: TInvitee[];
    images: string[];
}

export type TRow = {
    _id?: string;
    dataCollection: string;
    assignedTo?: string;
    notes?: string;
    notesList: INote[];
    cells: string[] | TCell;
    tags: TTag[];
    docs: TDocument[];
    links: string[];
    reminder?: boolean;
    complete?: boolean;
    acknowledged?: boolean;
    values?: any;
    parentRowId?: string;
    isVisible?: boolean;
    isParent?: boolean;
    fromView?: boolean;
};

export type TCell = {
    _id: string;
    dataCollection: string;
    row: string;
    name: string;
    type: string;
    people?: TUser[];
    labels?: TLabel[];
    docs?: TDocument[];
    links?: string[];
    value: string;
};

export type TLabel = {
    title: string;
    color: string;
    default: boolean;
    users?: string[];
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
    active?: boolean;
    icon: IconType;
    path: string;
}

export type TDocument = {
    _id?: string;
    workspace: string;
    createdBy?: any;
    filename: string;
    type: string;
    originalname?: string;
    url?: string;
    ext?: string;
    value?: string;
    file?: any;
    tags: TTag[];
};

export type TTag = {
    _id?: string;
    workspace: string;
    name: string;
};

export type TMessage = {
    _id?: string;
    content: string;
    workspace?: string;
    createdAt?: Date;
    createdBy?: TUser;
    read?: TUser[];
};
