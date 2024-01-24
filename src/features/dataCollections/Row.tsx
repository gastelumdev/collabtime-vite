import { Checkbox } from '@chakra-ui/react';
import React, { memo } from 'react';
import TextInput from './TextInput';
import LabelMenu from './LabelMenu';

interface IRowProps {
    row: any;
    columns: any[];
    rowIndex: number;
    onChange: any;
}

const Row = ({ row, columns, rowIndex, onChange }: IRowProps) => {
    return (
        <tr key={rowIndex}>
            <td style={{ padding: '4px 0 0 4px' }}>
                {/* <Checkbox onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCheckedRows([...checkedRows, rowIndex])} /> */}
            </td>
            {columns.map((column, columnIndex) => {
                return (
                    <td key={columnIndex} onClick={() => console.log(`${rowIndex}`)}>
                        {column.type === 'text' ? (
                            <TextInput id={rowIndex} columnName={column.name} value={row.values[column.name]} onChange={onChange} />
                        ) : column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                            <LabelMenu id={rowIndex} columnName={column.name} labels={column.labels} value={row.values[column.name]} onChange={onChange} />
                        ) : null}
                    </td>
                );
            })}
        </tr>
    );
};

export default memo(Row);
