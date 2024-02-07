import { useCallback, useEffect, useState } from 'react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Box, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { TCell } from '../../types';
import { RiEditBoxLine } from 'react-icons/ri';
import { useGetUserQuery } from '../../app/services/api';
import { IconContext } from 'react-icons';
import LabelMenu from './LabelMenu';
import PeopleMenu from './PeopleMenu';
import DateInput from './DateInput';
import TextInput from './TextInput';

interface IProps {
    cells?: TCell[];
    columns: any;
    row: any;
    handleChange: any;
}

const EditRow = ({ columns, row, handleChange }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    // const [updateCell] = useUpdateCellMutation();

    // const [editMode, setEditMode] = useState<string[]>([]);
    // const [tempValue, setTempValue] = useState('');
    // const [initialValue, setInitialValue] = useState('');

    const [_, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    // const handleUpdateRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTempValue(event.target.value);
    // };

    // const handleUpdateRowOnFocus = (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
    //     setInitialValue(event.target.value);
    //     const em: string[] = [];
    //     em.push(cell._id);
    //     setEditMode(em as any);
    //     setTempValue(event.target.value);
    // };

    // const handleUpdateRowOnBlur = async (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
    //     let newCell = cell;
    //     newCell = { ...newCell, value: event.target.value };
    //     if (initialValue != event.target.value) await updateCell(newCell);

    //     let tempEditMode = editMode;
    //     tempEditMode.pop();
    //     setEditMode(tempEditMode);
    // };

    // const handleLabelSelectChange = async (newValue: any, cell: TCell) => {
    //     let newCell = cell;
    //     newCell = { ...newCell, value: newValue.value };
    //     updateCell(newCell);
    // };

    // const handleAddExistingDocToCell = (cell: TCell, doc: TDocument) => {
    //     const docs: any = cell.docs;
    //     updateCell({ ...cell, docs: [...docs, doc] });
    // };

    const onChange = useCallback(
        (columnName: string, value: string) => {
            console.log(value);
            handleChange({ ...row, values: { ...row.values, [columnName]: value } });
        },
        [row]
    );
    return (
        <>
            <Box ml={'12px'} pb={'2px'} onClick={onOpen} cursor={'pointer'}>
                <IconContext.Provider value={{ color: '#cccccc', size: '17px' }}>
                    <RiEditBoxLine />
                </IconContext.Provider>
            </Box>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={'Edit row'}>
                {columns.map((column: any, columnIndex: number) => {
                    return (
                        <div
                            key={columnIndex}
                            className={'cell'}
                            style={{
                                whiteSpace: 'nowrap',
                                fontSize: '12px',
                                borderBottom: '1px solid #edf2f7',
                            }}
                        >
                            <Box py={'15px'} h={'80px'}>
                                <Text mb={'8px'} fontSize={'13px'}>{`${column.name[0].toUpperCase()}${column.name
                                    .slice(1, column.name.length)
                                    .split('_')
                                    .join(' ')}`}</Text>
                                {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                    <LabelMenu id={0} labels={column.labels} columnName={column.name} value={row.values[column.name]} onChange={onChange} />
                                ) : column.type === 'people' ? (
                                    <PeopleMenu row={row} columnName={column.name} people={column.people} value={row.values[column.name]} onChange={onChange} />
                                ) : column.type === 'date' ? (
                                    <DateInput value={row.values[column.name]} columnName={column.name} onChange={onChange} />
                                ) : (
                                    <TextInput id={row._id} columnName={column.name} value={row.values[column.name]} type="form" onChange={onChange} />
                                )}
                                {/* {row.values[column.name]} */}
                            </Box>
                        </div>
                    );
                })}
                <Flex mt={'10px'} width={'full'}>
                    <Spacer />
                    {/* <PrimaryButton onClick={updateData}>SAVE</PrimaryButton> */}
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default EditRow;
