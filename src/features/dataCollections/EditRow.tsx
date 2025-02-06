import { useCallback, useEffect, useState } from 'react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Box, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { TCell } from '../../types';
import { RiEditBoxLine } from 'react-icons/ri';
import { useGetUserQuery } from '../../app/services/api';
import LabelMenu from './LabelMenu';
import PeopleMenu from './PeopleMenu';
import DateInput from './DateInput';
import TextInput from './TextInput';
import Reference from '../../components/table/Reference';

interface IProps {
    cells?: TCell[];
    columns: any;
    row: any;
    handleChange?: any;
    allowed?: boolean;
}

const EditRow = ({ columns, row, handleChange, allowed = false }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    // const [updateCell] = useUpdateCellMutation();

    const [rowState, setRowState] = useState(row);

    useEffect(() => {
        setRowState(row);
    }, [row]);

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

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (rowState !== null && rowState.refs === undefined) {
            refs.push(ref);
            handleChange({ ...rowState, refs: { [columnName]: refs } });
        } else {
            if (rowState !== null && rowState.refs[columnName] === undefined) {
                handleChange({ ...rowState, refs: { ...rowState.refs, [columnName]: [ref] } });
            } else {
                handleChange({ ...rowState, refs: { ...rowState.refs, [columnName]: [...rowState.refs[columnName], ref] } });
            }
        }
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = rowState;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        handleChange({ ...rowState, refs: { ...rowState.refs, [columnName]: filteredRefs } });
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
            handleChange({ ...rowState, values: { ...rowState.values, [columnName]: value } });
        },
        [rowState]
    );
    return (
        <>
            <Box ml={'12px'} pb={'2px'} onClick={allowed ? onOpen : () => {}} cursor={allowed ? 'pointer' : 'default'}>
                {/* <IconContext.Provider value={{ color: allowed ? '#cccccc' : '', size: '17px' }}> */}
                <Text color={allowed ? 'gray.300' : 'gray.200'}>
                    <RiEditBoxLine size={'17px'} />
                </Text>
                {/* </IconContext.Provider> */}
            </Box>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={'Edit row'}>
                {columns.map((column: any, columnIndex: number) => {
                    if (column.isEmpty) return null;
                    return (
                        <div
                            key={columnIndex}
                            className={'cell'}
                            style={{
                                whiteSpace: 'nowrap',
                                fontSize: '12px',
                                marginBottom: '8px',
                                // borderBottom: `1px solid ${cellBorderColor}`,
                            }}
                        >
                            <Box h={'80px'}>
                                <Text mb={'8px'} fontSize={'13px'}>{`${column?.name[0].toUpperCase()}${column?.name
                                    .slice(1, column?.name.length)
                                    .split('_')
                                    .join(' ')}`}</Text>
                                <Box borderWidth={'1px'} borderStyle={'solid'} borderColor={'gray.200'} borderRadius={'2px'} h={'31px'}>
                                    {column?.type === 'label' || column?.type === 'priority' || column?.type === 'status' ? (
                                        <LabelMenu
                                            id={0}
                                            labels={column?.labels}
                                            columnName={column?.name}
                                            value={rowState.values !== undefined ? rowState.values[column?.name] : null}
                                            onChange={onChange}
                                            allowed={false}
                                        />
                                    ) : column?.type === 'people' ? (
                                        <PeopleMenu
                                            row={rowState}
                                            columnName={column?.name}
                                            people={column?.people}
                                            values={rowState.values !== undefined ? rowState.values[column?.name] : null}
                                            onChange={onChange}
                                            allowed={false}
                                        />
                                    ) : column?.type === 'date' ? (
                                        <DateInput
                                            value={rowState.values !== undefined ? rowState.values[column?.name] : null}
                                            columnName={column?.name}
                                            onChange={onChange}
                                            allowed={false}
                                        />
                                    ) : column?.type === 'reference' ? (
                                        <Reference
                                            column={column !== undefined ? column : {}}
                                            refsProp={row.refs && row.refs[column?.name] !== undefined ? row.refs[column?.name] : []}
                                            onRefChange={onRefChange}
                                            onRemoveRef={onRemoveRef}
                                            allowed={false}
                                        />
                                    ) : (
                                        <TextInput
                                            id={rowState._id}
                                            columnName={column?.name}
                                            value={rowState.values !== undefined ? rowState.values[column?.name] : null}
                                            type="form"
                                            onChange={onChange}
                                            allowed={false}
                                        />
                                    )}
                                </Box>
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
