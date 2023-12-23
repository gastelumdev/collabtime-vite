import React, { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Input, Spacer, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Select from "react-select";

import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";

import { TColumn, TLabel } from "../../types";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import Divider from "../../components/Divider/Divider";

import { getTextColor } from "../../utils/helpers";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { BsPlusCircle } from "react-icons/bs";
import { useParams } from "react-router-dom";

interface TProps {
    columns: TColumn[];
    createColumn: any;
}

const CreateColumn = ({ columns, createColumn }: TProps) => {
    const { dataCollectionId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const { data: columns } = useGetColumnsQuery(null);
    // const [createColumn] = useCreateColumnMutation();

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
        if (!columnNameError) {
            const newColumn: TColumn = {
                dataCollection: dataCollectionId || "",
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
            <Button onClick={onOpen} variant={"unstyled"}>
                <BsPlusCircle />
            </Button>
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
                                { value: "number", label: "Number" },
                                { value: "date", label: "Date" },
                                { value: "label", label: "Label" },
                                { value: "people", label: "Assign To" },
                                { value: "priority", label: "Priority" },
                                { value: "status", label: "Status" },
                                { value: "upload", label: "Uploads" },
                                { value: "link", label: "Link" },
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
    );
};

export default CreateColumn;
