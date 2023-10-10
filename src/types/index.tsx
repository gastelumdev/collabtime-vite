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
    workspaces: IWorkspace[];
};

export type IWorkspace = {
    _id: string;
    name: string;
    description: string;
    tools: ITools;
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
