import React, { useEffect, useState } from "react";
import { Input, Text, Flex, Spacer } from "@chakra-ui/react";
import Select from "react-select";
import { TDataCollection } from "../../types";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import { useGetDataCollectionsQuery } from "../../app/services/api";

let defaultValues: TDataCollection = {
    name: "",
    description: "",
    workspace: "",
    template: "default",
    form: {
        active: false,
        type: "null",
        emails: [],
    },
    columns: [],
    rows: [],
    tags: [],
};

interface IProps {
    addNewDataCollection: any;
}

const Create = ({ addNewDataCollection }: IProps) => {
    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<TDataCollection>(defaultValues);
    const [inputError, setInputError] = useState<boolean>(false);
    const [selectFormattedDataCollections, setSelectFormattedDataCollections] = useState<any[]>([]);

    useEffect(() => {
        const formattedDC = [];
        for (const dataCollection of dataCollections || []) {
            if (dataCollection.asTemplate !== undefined && dataCollection.asTemplate.active) {
                formattedDC.push({ value: dataCollection._id, label: dataCollection.asTemplate.name });
            }
        }
        console.log(formattedDC);
        setSelectFormattedDataCollections(formattedDC);
    }, [dataCollections]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const createData = async () => {
        const newDataCollection = data;
        console.log(newDataCollection);
        addNewDataCollection(newDataCollection);
        setData(defaultValues);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        if (value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleTemplateChange = (selectedOption: any) => {
        setData({
            ...data,
            template: selectedOption.value,
        });
    };

    return (
        <>
            <PrimaryButton onClick={showDrawer}>NEW COLLECTION</PrimaryButton>
            <PrimaryDrawer title="Create a new data collection" onClose={onClose} isOpen={open}>
                <Flex>
                    <Text pb={"5px"}>Name</Text>
                    <Text ml={"8px"} pt={"2px"} fontSize={"14px"} color={"#e53e3e"}>
                        {inputError ? "* Name exceeds character limit" : ""}
                    </Text>
                </Flex>
                <Input
                    name="name"
                    placeholder="Please enter user name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Text pb={"5px"}>Template</Text>
                <Select
                    id="columnType"
                    name="columnType"
                    placeholder="Please select column type"
                    onChange={(selectedOption: any) => handleTemplateChange(selectedOption)}
                    options={[
                        { value: "default", label: "Default" },
                        { value: "tasks", label: "Task List" },
                    ].concat(selectFormattedDataCollections)}
                    styles={
                        {
                            control: (styles: any) => {
                                return { ...styles, borderColor: "#e2e8f0", marginBottom: "20px" };
                            },
                        } as any
                    }
                />
                <Flex>
                    <Spacer />
                    <PrimaryButton onClick={createData} isDisabled={inputError}>
                        SAVE
                    </PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default Create;
