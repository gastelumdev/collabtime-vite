import React, { useEffect, useState } from "react";
import {
    useGetColumnsQuery,
    useCreateColumnMutation,
    useGetDataCollectionQuery,
    useGetOneWorkspaceQuery,
} from "../../app/services/api";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Container,
    Flex,
    HStack,
    Heading,
    Input,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import Select from "react-select";

import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { AiOutlineClose, AiOutlineMessage } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { TColumn, TLabel } from "../../types";
import Divider from "../../components/Divider/Divider";

import { getTextColor } from "../../utils/helpers";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import DataCollection from "./DataCollection";

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
        path: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
    },
    {
        name: "Tasks",
        icon: FaTasks,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/taskLists`,
    },
    {
        name: "Documents",
        icon: BsFiletypeDoc,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
    },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard`,
    },
];

const ViewOne = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: dataCollection } = useGetDataCollectionQuery(null);
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem("workspaceId") || "");

    const { data: columns } = useGetColumnsQuery(null);
    const [createColumn] = useCreateColumnMutation();

    const [columnName, setColumnName] = useState<string>("");
    const [columnType, setColumnType] = useState<string>("text");
    const [columnNameError, setColumnNameError] = useState<boolean>(false);
    const [showLabelForm, setShowLabelForm] = useState(false);
    const [labelOptions, setLabelOptions] = useState<TLabel>({
        title: "",
        color: "#015796",
    });
    const [labels, setLabels] = useState<TLabel[]>([
        { title: "Label 1", color: "#005796" },
        { title: "Label 2", color: "#4FAD00" },
        { title: "Label 3", color: "#ffa507" },
    ]);
    const [labelStyles, setLabelStyles] = useState<any>({});
    const [labelTitleError, setLabelTitleError] = useState<boolean>(false);

    useEffect(() => {
        for (const column of columns || []) {
            if (column.type === "label") {
                setLabelStyles({ ...labelStyles, [column.name]: "" });
            }
        }
        setShowLabelForm(false);
    }, []);

    /**
     * Creates a new column
     * This should be replaced by RTK
     */
    const handleAddColumn = () => {
        console.log(columnName);
        if (!columnNameError) {
            const newColumn: TColumn = {
                dataCollectionId: localStorage.getItem("dataCollectionId") || "",
                name: columnName,
                type: columnType,
                permanent: false,
                labels: labels,
                people: [],
                includeInForm: true,
                includeInExport: true,
            };

            // Set column name to a database friendly underscore naming
            newColumn.name = newColumn.name.toLowerCase().split(" ").join("_");

            createColumn(newColumn);
            onClose();
        }
    };

    /**
     * Sets the column name when input changes in create column drawer
     * @param event
     */
    const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const columnNamesMap: any = {};

        for (const column of columns || []) {
            if (columnNamesMap[column.name] == undefined) columnNamesMap[column.name] = column.name;
        }

        if (columnNamesMap[value.toLowerCase().split(" ").join("_")] || value == "") {
            setColumnNameError(true);
        } else {
            setColumnNameError(false);
            setColumnName(value);
        }
    };

    const handleSelectType = (selectedOption: any) => {
        setColumnType(selectedOption.value);

        if (selectedOption.value === "label") {
            setShowLabelForm(true);
        } else {
            setShowLabelForm(false);
        }

        if (selectedOption.value === "priority") {
            setLabels([
                { title: "Low", color: "#28B542" },
                { title: "High", color: "#FFA500" },
                { title: "Critical", color: "#FF0000" },
            ]);
        }

        if (selectedOption.value === "status") {
            setLabels([
                { title: "Ready to start", color: "#121f82" },
                { title: "Working on it", color: "#146c96" },
                { title: "Pending review", color: "#FFA500" },
                { title: "Done", color: "#28B542" },
            ]);
        }
    };

    const handleLabelOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name == "title" && event.target.value == "") {
            setLabelTitleError(true);
        } else {
            setLabelTitleError(false);
        }
        setLabelOptions({
            ...labelOptions,
            [event.target.name]: event.target.value,
        });
    };

    const removeLabel = (label: TLabel) => {
        const newLabels = labels.filter((item: TLabel) => {
            return label.title !== item.title;
        });

        setLabels(newLabels);
    };

    const addLabel = () => {
        setLabelTitleError(false);
        if (labelOptions.title === "") {
            setLabelTitleError(true);
        } else {
            const labelsCopy = [...labels, labelOptions];
            setLabels(labelsCopy);
            setLabelOptions({ title: "", color: "#015796" });
        }
    };

    const closeDrawer = () => {
        onClose();
        setShowLabelForm(false);
        setColumnName("");
        setColumnType("");
        setLabels([
            { title: "Label 1", color: "#005796" },
            { title: "Label 2", color: "#4FAD00" },
            { title: "Label 3", color: "#ffa507" },
        ]);
        setLabelOptions({
            title: "",
            color: "#015796",
        });
    };

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
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
                                {/* <Flex>
                                    <Box>
                                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                            Data Collections
                                        </Heading>
                                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                            Create data collection tables to visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex> */}
                            </SimpleGrid>
                            <Card mb={"60px"}>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading size={"sm"} mt={"5px"} mb={"4px"}>
                                                {`${workspace?.name} - ${dataCollection?.name}`}
                                            </Heading>
                                            <Text fontSize={"md"} color={"rgb(123, 128, 154)"}>
                                                {dataCollection?.description}
                                            </Text>
                                        </Box>
                                        <Spacer />
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <DataCollection onOpen={onOpen} />
                                </CardBody>
                            </Card>

                            {/* </SimpleGrid> */}
                        </Container>
                    </Flex>
                </Box>
            </SideBarLayout>
            <PrimaryDrawer isOpen={isOpen} onClose={closeDrawer} title={"Create a new column"}>
                <Stack spacing="24px">
                    <Box>
                        <Flex>
                            <Text mb={"5px"}>Name</Text>
                            <Text ml={"8px"} pt={"2px"} fontSize={"14px"} color={"#e53e3e"}>
                                {columnNameError ? "* Column already exists or name is empty." : ""}
                            </Text>
                        </Flex>
                        <Input
                            // ref={firstField}
                            id="columnName"
                            name="columnName"
                            placeholder="Please enter column name"
                            onChange={handleColumnNameChange}
                            isInvalid={columnNameError}
                        />
                    </Box>
                    <Box>
                        <Text mb={"5px"}>Type</Text>
                        <Select
                            id="columnType"
                            name="columnType"
                            placeholder="Please select column type"
                            onChange={(selectedOption: any) => handleSelectType(selectedOption)}
                            options={[
                                { value: "text", label: "Text" },
                                { value: "date", label: "Date" },
                                { value: "label", label: "Label" },
                                { value: "people", label: "Assign To" },
                                { value: "priority", label: "Priority" },
                                { value: "status", label: "Status" },
                            ]}
                            styles={
                                {
                                    control: (styles: any) => {
                                        return { ...styles, borderColor: "#e2e8f0" };
                                    },
                                } as any
                            }
                        />
                    </Box>
                    {showLabelForm ? (
                        <>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                                marginTop="0"
                            />
                            <Flex>
                                <Box mr={"20px"}>
                                    <HStack>
                                        <Text mb={"10px"}>Labels</Text>
                                        {labelTitleError ? (
                                            <Text mb={"5px"} color={"red"} fontSize={"sm"}>
                                                * Required
                                            </Text>
                                        ) : null}
                                    </HStack>
                                    <Input
                                        // ref={firstField}
                                        id="labelName"
                                        name="title"
                                        value={labelOptions.title}
                                        size={"sm"}
                                        placeholder="Please enter label name"
                                        onChange={handleLabelOptionsChange}
                                    />
                                </Box>
                                <Box mb={"10px"} pt={"32px"}>
                                    {/* <Text mb={"5px"}>Label color</Text> */}
                                    <HStack>
                                        <MdOutlineColorLens color={"rgb(123, 128, 154)"} />
                                        <Box pt={"5px"}>
                                            <input
                                                type={"color"}
                                                // ref={firstField}
                                                id="labelColor"
                                                name="color"
                                                height={"300px"}
                                                value={labelOptions.color}
                                                onChange={handleLabelOptionsChange}
                                            />
                                        </Box>
                                    </HStack>
                                </Box>
                                <Spacer />
                                <Box mt={"36px"}>
                                    <PrimaryButton onClick={addLabel} isDisabled={labelOptions.title == ""} size="sm">
                                        Add label
                                    </PrimaryButton>
                                </Box>
                            </Flex>
                            <Box>
                                {labels.map((label: TLabel, index: number) => {
                                    console.log(label);
                                    return (
                                        <Box key={index} bg={label.color} p={"5px"} m={"5px"}>
                                            <HStack>
                                                <AiOutlineClose
                                                    color={getTextColor(label.color)}
                                                    onClick={() => removeLabel(label)}
                                                />
                                                <Text color={getTextColor(label.color)}>{label.title}</Text>
                                            </HStack>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    ) : null}
                </Stack>
                <Flex mt={"20px"}>
                    <Spacer />
                    <PrimaryButton onClick={handleAddColumn} isDisabled={columnNameError || columnName == ""}>
                        SAVE
                    </PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
        // </Layout>
    );
};

export default ViewOne;
