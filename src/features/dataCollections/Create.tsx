import React, { useState } from "react";
import { Input, Text, Flex, Spacer } from "@chakra-ui/react";
import { TDataCollection } from "../../types";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import PrimaryDrawer from "../../components/PrimaryDrawer";

let defaultValues: TDataCollection = {
    name: "",
    description: "",
    workspace: "",
    form: {
        active: false,
        type: "null",
        emails: [],
    },
    columns: [],
    rows: [],
};

interface IProps {
    addNewDataCollection: any;
}

const Create = ({ addNewDataCollection }: IProps) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<TDataCollection>(defaultValues);

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
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <>
            <PrimaryButton onClick={showDrawer}>NEW COLLECTION</PrimaryButton>
            <PrimaryDrawer title="Create a new data collection" onClose={onClose} isOpen={open}>
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    placeholder="Please enter user name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Flex>
                    <Spacer />
                    <PrimaryButton onClick={createData}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default Create;
