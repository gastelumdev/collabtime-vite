import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';

const ImportDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [file, setFile] = useState<any>();
    const [array, setArray] = useState<any>([]);

    const fileReader = new FileReader();

    const csvFileToArray = (string: string) => {
        const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
        const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

        const array = csvRows.map((i) => {
            const values = i.split(',');
            console.log(values);
            const obj = csvHeader.reduce((object: any, header: any, index: number) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });

        console.log(array);

        setArray(array);
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files);
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleOnSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput: any = event.target?.result;
                console.log(csvOutput);
                csvFileToArray(csvOutput);
            };

            fileReader.readAsText(file);
        }
    };

    const headerKeys = Object.keys(Object.assign({}, ...array));

    return (
        <>
            <Text onClick={() => onOpen()}>Import</Text>
            <Drawer isOpen={isOpen} onClose={onClose} size={'full'}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Import</DrawerHeader>

                    <DrawerBody>
                        <Text>Imports</Text>
                        <input type={'file'} accept={'.csv'} onChange={handleOnChange} />
                        <table>
                            <thead>
                                <tr key={'header'}>
                                    {headerKeys.map((key) => (
                                        <th>{key}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {array.map((item: any) => (
                                    <tr key={item.id}>
                                        {Object.values(item).map((val: any) => (
                                            <td>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleOnSubmit}>
                            Import
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ImportDrawer;
