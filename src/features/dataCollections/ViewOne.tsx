import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Container,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Textarea,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { default as PrimaryButton } from "../../components/Buttons/PrimaryButton";
import SideBarLayout from "../../components/Layouts/SideBarLayout";

import { CompactTable } from "@table-library/react-table-library/compact";
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
    DEFAULT_OPTIONS,
    getTheme,
} from "@table-library/react-table-library/material-ui";
import { BsFiletypeDoc, BsPersonWorkspace, BsPlusCircle } from "react-icons/bs";
import { IconContext, IconType } from "react-icons";
import { useEffect, useState } from "react";
import React from "react";
import {
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineMessage,
} from "react-icons/ai";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import AddForm from "./AddForm";
import { IDataCollection } from "../../types";

const nodes = [
    {
        id: "0",
        name: "Shopping List",
        type: "TASK",
    },
    {
        id: "1",
        name: "Shopping List",
        type: "TASK",
    },
    {
        id: "2",
        name: "Shopping List",
        type: "TASK",
    },
];

const dataCollection: IDataCollection = {
    _id: "1",
    name: "Data Collection 1",
    workspace: "1",
    form: {
        active: false,
        type: "",
        emails: [],
    },
    columns: ["1", "2", "3", "4"],
    rows: ["1", "2", "3"],
};

const columnsData = [
    {
        _id: "1",
        dataCollectionId: "1",
        name: "assigned_to",
        type: "Person",
        permanent: true,
        people: [],
        includeInForm: true,
        includeInExport: true,
    },
    {
        _id: "2",
        dataCollectionId: "1",
        name: "priority",
        type: "Label",
        permanent: true,
        labels: [
            { title: "Low", color: "blue" },
            { title: "High", color: "orange" },
        ],
        includeInForm: true,
        includeInExport: true,
    },
    {
        _id: "3",
        dataCollectionId: "1",
        name: "status",
        type: "Label",
        permanent: true,
        labels: [
            { title: "In-Progress", color: "green" },
            { title: "Complete", color: "yellow" },
        ],
        includeInForm: true,
        includeInExport: true,
    },
];

const rowsData = [
    {
        _id: "1",
        dataCollectionId: "1",
        cells: ["1", "2", "3"],
    },
    {
        _id: "2",
        dataCollectionId: "1",
        cells: ["4", "5", "6"],
    },
    {
        _id: "3",
        dataCollectionId: "1",
        cells: ["7", "8", "9"],
    },
];

const cellsData = [
    {
        _id: "1",
        rowId: "1",
        name: "assigned_to",
        type: "Person",
        people: [{ firstname: "String", lastname: "String" }],
        value: "Omar Gastelum",
    },
    {
        _id: "2",
        rowId: "1",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Low",
    },
    {
        _id: "3",
        rowId: "1",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Complete",
    },
    {
        _id: "4",
        rowId: "2",
        name: "assigned_to",
        type: "Person",
        people: [{ firstname: "String", lastname: "String" }],
        value: "Carlos Torres",
    },
    {
        _id: "5",
        rowId: "2",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Low",
    },
    {
        _id: "6",
        rowId: "2",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Complete",
    },
    {
        _id: "7",
        rowId: "3",
        name: "assigned_to",
        type: "Person",
        people: [{ firstname: "String", lastname: "String" }],
        value: "Rick Ruiz",
    },
    {
        _id: "8",
        rowId: "3",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Low",
    },
    {
        _id: "9",
        rowId: "3",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Complete",
    },
];

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: BiTable,
        path: "/workspaces/1/dataCollections",
    },
    { name: "Tasks", icon: FaTasks, path: "/workspaces/1/taskLists" },
    { name: "Documents", icon: BsFiletypeDoc, path: "/workspaces/1/documents" },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: "/workspaces/1/messageBoard",
    },
];

const ViewOne = () => {
    const toast = useToast();
    const toastIdRef = React.useRef();
    // const data = { nodes };
    const [data, setData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rows, setRows] = useState<any[]>(rowsData);
    const [cells, setCells] = useState<any[]>(cellsData);
    const [columns, setColumns] = useState(columnsData);
    const [column, setColumn] = useState("");
    const [checkedItems, setCheckedItems] = useState(
        new Array(rowsData.length).fill(false)
    );
    const [numberChecked, setNumberChecked] = useState(0);
    const [showRowForm, setShowRowForm] = useState(false);
    const firstField = React.useRef();
    // const materialTheme = getTheme(DEFAULT_OPTIONS);
    const theme = useTheme({
        Table: `
            grid-template-columns: 20px repeat(${columns.length - 1}, 1fr) 1fr;
        `,
        Cell: `&:nth-of-type(1) {
            width: 60px
          }`,
        HeaderRow: `
            .th {
                color: rgb(123, 128, 154);
                padding: 12px 16px 12px 26px;
                border-bottom: 0.0625rem solid rgb(240, 242, 245);
                font-size: 12px;
            }
          `,
        BaseCell: `
            color: rgb(123, 128, 154);
            padding: 10px 16px;
            border-bottom: 0.0625rem solid rgb(240, 242, 245);
            font-size: 14px;

          `,
    });

    useEffect(() => {
        convertData();
    }, []);

    const openNewColumnDrawer = () => {
        onOpen();
    };

    const convertData = () => {
        const convertedArray = [];
        const cellsCopy = cells;

        for (const row of rowsData) {
            let id = row._id;
            const filteredRows = cellsCopy.filter((cell) => {
                return cell.rowId === id;
            });

            let newRow = { id: id };
            for (const filteredRow of filteredRows) {
                newRow[filteredRow.name as keyof typeof newRow] =
                    filteredRow.value;
            }

            convertedArray.push(newRow);
        }
        // console.log(convertedArray);
        setData(convertedArray as any);
    };

    // const COLUMNS = [
    //     { label: "Task", renderCell: (item: any) => item.name, resize: true },
    //     { label: "Type", renderCell: (item: any) => item.type, resize: true },
    //     {
    //         label: (
    //             <IconContext.Provider value={{ size: "16" }}>
    //                 <Button bg={"none"} onClick={openNewColumnDrawer}>
    //                     <BsPlusCircle />
    //                 </Button>
    //             </IconContext.Provider>
    //         ),
    //         renderCell: () => null,
    //         resize: true,
    //     },
    // ];

    // const COLUMNS = () => {
    //     return dataCollection.columns.cells.map((cell: any) => {
    //         return { label: cell.name, renderCell: (item: any) => item.value };
    //     });
    // };

    const handleAddColumn = () => {
        const sampleColumn = {
            _id: "1",
            dataCollectionId: "1",
            name: "assigned_to",
            type: "Person",
            permanent: true,
            people: [],
            includeInForm: true,
            includeInExport: true,
        };

        const newColumn = {
            dataCollectionsId: "1",
            name: column,
            type: "Person",
            permanent: false,
            people: [],
            includeInForm: true,
            includeInExport: true,
        };

        console.log(newColumn);
        const columnsCopy = columns;
        columnsCopy.push(newColumn as any);
        console.log(columnsCopy);
        // const lastColumn = columnsCopy.pop();
        // const newColumns = [...columnsCopy, newColumn, lastColumn];
        // console.log(newColumns);
        setColumns(columnsCopy as any);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setColumn(value);
    };

    const handleUpdate = (value: string, item: any, name: string) => {
        console.log(value);
        console.log(item);

        const dataCopy = data;

        const changedData = dataCopy.map((dataItem: any) => {
            if (dataItem.id === item.id) {
                return { ...dataItem, [name]: value };
            } else {
                return dataItem;
            }
        });

        console.log(changedData);

        setData(changedData as any);
    };

    const updateCells = (value: string, item: any, name: string) => {
        console.log(data);
        console.log(cells);
        console.log(item);
        console.log(name);

        const rowId = item.id;

        const newCells = cells.map((cell: any) => {
            if (cell.rowId === rowId && cell.name === name) {
                let newCell = { ...cell, value: value };
                // Update database cell here *********************************
                return newCell;
            } else {
                return cell;
            }
        });

        setCells(newCells);
    };

    const handleAddCell = (value: string, name: string) => {
        console.log(name);
    };

    const handleCheckboxChange = (checked: boolean, index: number) => {
        console.log(index);
        console.log(checkedItems);
        console.log(numberChecked);
        console.log(checked);

        const checkedItemsCopy = checkedItems;
        checkedItemsCopy[index] = !checkedItemsCopy[index];
        console.log(checkedItemsCopy);
        setCheckedItems(checkedItemsCopy);

        let numberCheckedCopy = numberChecked;
        if (checked) {
            setNumberChecked(numberCheckedCopy + 1);
        } else {
            setNumberChecked(numberCheckedCopy - 1);
        }

        console.log(numberChecked);
    };

    const deleteItems = () => {
        let dataCopy: any = data;
        for (const index in checkedItems) {
            console.log(index);
            let checkedItem = checkedItems[index];
            if (checkedItem) {
                dataCopy[index] = null;
            }
        }

        const newRows = dataCopy.filter((item: any) => {
            return item !== null;
        });

        setData(newRows);
        setCheckedItems(new Array(data.length).fill(false));
        setNumberChecked(0);
    };

    const updateDataCollection = (dataCollection: IDataCollection) => {
        console.log("Data Collection updated");
        console.log(dataCollection);
        // Make call to update the data collection *************************************
    };

    return (
        <>
            <SideBarLayout
                linkItems={LinkItems}
                // breadcrumbs={
                //     <Breadcrumb fontSize={"14px"}>
                //         <BreadcrumbItem>
                //             <BreadcrumbLink href="/workspaces" color="#929dae">
                //                 Workspaces
                //             </BreadcrumbLink>
                //         </BreadcrumbItem>
                //         <BreadcrumbItem>
                //             <BreadcrumbLink
                //                 href="/workspaces/1"
                //                 color="#929dae"
                //             >
                //                 Workspace 1
                //             </BreadcrumbLink>
                //         </BreadcrumbItem>
                //         <BreadcrumbItem>
                //             <BreadcrumbLink
                //                 href="/workspaces/1/dataCollections"
                //                 color="#929dae"
                //             >
                //                 Data Collections
                //             </BreadcrumbLink>
                //         </BreadcrumbItem>
                //         <BreadcrumbItem isCurrentPage>
                //             <BreadcrumbLink href="#" color="#929dae">
                //                 Data Collection 1
                //             </BreadcrumbLink>
                //         </BreadcrumbItem>
                //     </Breadcrumb>
                // }
            >
                <Box>
                    <Flex
                        minH={"100vh"}
                        // justify={"center"}
                        bg={"#eff2f5"}
                    >
                        <Container maxW={"8xl"} mt={{ base: 4, sm: 0 }}>
                            <SimpleGrid
                                spacing={6}
                                // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                columns={{ base: 1, sm: 2 }}
                                pb={"30px"}
                            >
                                <Flex>
                                    <Box>
                                        <Heading
                                            size={"sm"}
                                            mb={"12px"}
                                            color={"rgb(52, 71, 103)"}
                                        >
                                            Data Collections
                                        </Heading>
                                        <Text
                                            color={"rgb(123, 128, 154)"}
                                            fontSize={"md"}
                                            fontWeight={300}
                                        >
                                            Create data collection tables to
                                            visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex>
                                    <Spacer />
                                    <Box pb={"20px"}>
                                        {/* <Create addNewWorkspace={addNewWorkspace} /> */}
                                    </Box>
                                </Flex>
                            </SimpleGrid>
                            <Card>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading
                                                size={"sm"}
                                                mt={"5px"}
                                                mb={"4px"}
                                            >
                                                Data Collection 1
                                            </Heading>
                                            <Text
                                                fontSize={"md"}
                                                color={"rgb(123, 128, 154)"}
                                            >
                                                This is a description for this
                                                data collection.
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        {/* <PrimaryButton
                                            onClick={onOpen}
                                            float={"right"}
                                        >
                                            ADD FORM
                                        </PrimaryButton> */}
                                        <AddForm
                                            updateDataCollection={
                                                updateDataCollection
                                            }
                                            dataCollection={dataCollection}
                                        />
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Button
                                        onClick={onOpen}
                                        variant={"unstyled"}
                                        float={"right"}
                                    >
                                        <BsPlusCircle />
                                    </Button>
                                    <Table
                                        data={{ nodes: data }}
                                        layout={{
                                            isDiv: true,
                                            // custom: true,
                                            horizontalScroll: true,
                                        }}
                                        theme={theme}
                                    >
                                        {(tableList: any) => (
                                            <>
                                                <Header>
                                                    <HeaderRow>
                                                        <HeaderCell
                                                            resize
                                                        ></HeaderCell>
                                                        {columns.map(
                                                            (column: any) => {
                                                                return (
                                                                    <HeaderCell
                                                                        key={
                                                                            column.name
                                                                        }
                                                                        resize
                                                                    >
                                                                        {
                                                                            column.name
                                                                        }
                                                                    </HeaderCell>
                                                                );
                                                            }
                                                        )}
                                                    </HeaderRow>
                                                </Header>

                                                <Body>
                                                    {tableList.map(
                                                        (
                                                            item: any,
                                                            index: number
                                                        ) => {
                                                            console.log(index);
                                                            return (
                                                                <Row
                                                                    key={index}
                                                                    item={item}
                                                                >
                                                                    <Cell>
                                                                        <Checkbox
                                                                            isChecked={
                                                                                checkedItems[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            mt={
                                                                                "5px"
                                                                            }
                                                                            onChange={(
                                                                                event: React.ChangeEvent<HTMLInputElement>
                                                                            ) =>
                                                                                handleCheckboxChange(
                                                                                    event
                                                                                        .target
                                                                                        .checked,
                                                                                    index
                                                                                )
                                                                            }
                                                                        />
                                                                    </Cell>
                                                                    {columns.map(
                                                                        (
                                                                            cell: any,
                                                                            index: number
                                                                        ) => {
                                                                            return (
                                                                                <Cell
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    <Input
                                                                                        size={
                                                                                            "xs"
                                                                                        }
                                                                                        border={
                                                                                            "none"
                                                                                        }
                                                                                        m={
                                                                                            "1px"
                                                                                        }
                                                                                        w={
                                                                                            "95%"
                                                                                        }
                                                                                        fontSize={
                                                                                            "14px"
                                                                                        }
                                                                                        focusBorderColor="blue"
                                                                                        value={
                                                                                            item[
                                                                                                cell
                                                                                                    .name
                                                                                            ]
                                                                                        }
                                                                                        onChange={(
                                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                                        ) =>
                                                                                            handleUpdate(
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                                item,
                                                                                                cell.name
                                                                                            )
                                                                                        }
                                                                                        onBlur={(
                                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                                        ) =>
                                                                                            updateCells(
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                                item,
                                                                                                cell.name
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </Cell>
                                                                            );
                                                                        }
                                                                    )}
                                                                    {/* <Cell></Cell> */}
                                                                </Row>
                                                            );
                                                        }
                                                    )}
                                                    {showRowForm ? (
                                                        <>
                                                            <Row
                                                                item={{
                                                                    id: "",
                                                                    nodes: undefined,
                                                                }}
                                                            >
                                                                <Cell></Cell>
                                                                {columns.map(
                                                                    (
                                                                        cell: any,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <Cell
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <Input
                                                                                    size={
                                                                                        "xs"
                                                                                    }
                                                                                    m={
                                                                                        "1px"
                                                                                    }
                                                                                    w={
                                                                                        "95%"
                                                                                    }
                                                                                    onChange={(
                                                                                        event: React.ChangeEvent<HTMLInputElement>
                                                                                    ) =>
                                                                                        handleAddCell(
                                                                                            event
                                                                                                .target
                                                                                                .value,
                                                                                            cell.name
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Cell>
                                                                        );
                                                                    }
                                                                )}
                                                            </Row>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                setShowRowForm(
                                                                    true
                                                                )
                                                            }
                                                            size={"xs"}
                                                            margin={"10px"}
                                                            marginLeft={"14px"}
                                                            bg={"none"}
                                                            color={
                                                                "rgb(123, 128, 154)"
                                                            }
                                                            p={"0"}
                                                            w={"100px"}
                                                        >
                                                            + Add Row
                                                        </Button>
                                                    )}
                                                </Body>
                                            </>
                                        )}
                                    </Table>
                                    {showRowForm ? (
                                        <>
                                            <IconContext.Provider
                                                value={{ size: "18" }}
                                            >
                                                <Button
                                                    size={"xs"}
                                                    variant={"unstyled"}
                                                    fontSize={"14px"}
                                                    fontWeight={"bold"}
                                                    color={"green"}
                                                    p={0}
                                                    bg={"transparent"}
                                                    position={"relative"}
                                                    bottom={"40px"}
                                                    right={"15px"}
                                                    onClick={() =>
                                                        setShowRowForm(false)
                                                    }
                                                >
                                                    <AiOutlineCheckCircle />
                                                </Button>
                                                <Button
                                                    size={"xs"}
                                                    variant={"unstyled"}
                                                    fontSize={"14px"}
                                                    fontWeight={"bold"}
                                                    color={"rgb(233, 30, 99)"}
                                                    p={0}
                                                    bg={"transparent"}
                                                    position={"relative"}
                                                    bottom={"40px"}
                                                    right={"15px"}
                                                    onClick={() =>
                                                        setShowRowForm(false)
                                                    }
                                                >
                                                    <AiOutlineCloseCircle />
                                                </Button>
                                            </IconContext.Provider>
                                        </>
                                    ) : null}
                                </CardBody>
                            </Card>
                            {numberChecked > 0 ? (
                                <Card position={"relative"}>
                                    <Card
                                        position={"fixed"}
                                        bottom={30}
                                        left={{ base: 30, lg: 300 }}
                                        w={{ sm: "300px", md: "500px" }}
                                    >
                                        <CardBody>
                                            <Flex>
                                                <Text mt={"10px"}>
                                                    You've selected{" "}
                                                    {numberChecked}{" "}
                                                    {numberChecked === 1
                                                        ? "item"
                                                        : "items"}
                                                    . Click to delete them.
                                                </Text>
                                                <Spacer />
                                                <Button
                                                    colorScheme="red"
                                                    onClick={deleteItems}
                                                >
                                                    Delete
                                                </Button>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </Card>
                            ) : null}
                            {/* </SimpleGrid> */}
                        </Container>
                    </Flex>
                </Box>
            </SideBarLayout>
            <Drawer
                isOpen={isOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Add a new column
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            <Box>
                                <FormLabel htmlFor="columnName">Name</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="columnName"
                                    name="columnName"
                                    placeholder="Please enter columnName"
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleAddColumn}>
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
        // </Layout>
    );
};

export default ViewOne;
