import { Button } from '@chakra-ui/react';
import React from 'react';
import { useCreateRowMutation } from '../../app/services/api';

interface IProps {
    addRow: any;
}

const AddRow = ({ addRow }: IProps) => {
    const [createRow] = useCreateRowMutation();
    const handleAddRowClick = async () => {
        const newRow: any = { dataCollection: localStorage.getItem('dataCollectionId') };

        const rowRes: any = await createRow(newRow);

        addRow(rowRes.data);
    };
    return <Button onClick={handleAddRowClick}>Add Row</Button>;
};

export default AddRow;
