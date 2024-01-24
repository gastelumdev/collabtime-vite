import { Box, Button, Checkbox, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { TColumn, TRow } from '../../types';
import { useGetColumnsQuery, useGetRowsQuery } from '../../app/services/api';
import EditRow from './EditRow';
import LabelMenu from './LabelMenu';
import TextInput from './TextInput';
import PeopleMenu from './PeopleMenu';
import AddRow from './AddRow';

interface IProps {
    // columns?: TColumn[];
    // rows?: TRow[];
    // rowsLoading?: boolean;
    // rowsFetching?: boolean;
    dataCollectionId: string;
    permissions?: number;
    // type?: string;
}

const DataCollectionWorkbench = ({
    // columns,
    // rows,
    // rowsLoading,
    // rowsFetching,
    dataCollectionId,
    permissions = 2,
}: // type = 'table',
IProps) => {
    const { data: columnsData } = useGetColumnsQuery(dataCollectionId || '');

    const [columns, setColumns] = useState<TColumn[]>(columnsData || []);

    const {
        data: rowsData,
        // isLoading: rowsLoading,
        // isFetching: rowsFetching,
        isSuccess: rowsSuccess,
    } = useGetRowsQuery({
        dataCollectionId: dataCollectionId || '',
        // limit: limit,
        // skip: skip,
        // sort: sort,
        // sortBy: sortBy,
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
    });

    const [rows, setRows] = useState<TRow[]>(rowsData || []);

    /**
     * Array that keeps track of the what rows are checked
     */
    // const [checkboxes, setCheckboxes] = useState<boolean[]>([]);

    useEffect(() => {
        console.log('LOADED...');
        console.log('something');
        setColumns(columnsData || []);
    }, []);

    useEffect(() => {
        setRows(rowsData || []);
    }, [rowsData]);

    const updateRows = useCallback((newRow: TRow, rowIndex: number) => {
        setRows((prevItems) => {
            return prevItems.splice(rowIndex, 1, newRow);
        });
    }, []);

    const addRow = (newRow: TRow) => {
        // const values: any = {};

        // for (const column of columns) {
        //     values[column.name] = '';
        // }

        // newRow.values = values;

        // setRows([...rows, ...[newRow]]);
        setRows((rows) => {
            const newRows = [...rows, newRow];
            return newRows;
        });
        console.log(newRow);
    };

    return (
        <TableContainer
        // pb={type === 'table' ? '300px' : '0'}
        // pb={'300px'}
        >
            <Table size="sm" style={{ tableLayout: 'fixed' }}>
                <Thead>
                    <Tr>
                        {columnsData?.map((column: TColumn, index: number) => {
                            console.log('COLUMNS RENDERED');
                            let width = '200px';

                            if (column.type === 'people') width = '145px';
                            if (column.type === 'date') width = '210px';
                            if (column.type === 'priority' || column.type === 'status' || column.type === 'label') width = '170px';
                            if (column.type === 'number') width = '120px';
                            if (column.type === 'link' || column.type === 'upload') width = '120px';
                            return (
                                <Th key={index} width={width}>
                                    {/* {(permissions || 0) > 1 ? (
                                        <Menu>
                                            <MenuButton
                                            // onClick={() => handleColumnHover(index)}
                                            >
                                                <Text as={'b'}>{column.name.split('_').join(' ').toUpperCase()}</Text>
                                            </MenuButton>
                                            <MenuList>
                                                <RenameColumn column={column} />
                                                <DeleteColumnAlert column={column} />
                                                <MenuGroup title="Sort">
                                                    <MenuItem onClick={() => handleDescendingSortClick(column.name)}>Sort Descending</MenuItem>
                                                    <MenuItem onClick={() => handleAscendingSortClick(column.name)}>Sort Ascending</MenuItem>
                                                </MenuGroup>
                                            </MenuList>
                                        </Menu>
                                    ) : (
                                        column.name.split('_').join(' ').toUpperCase()
                                    )} */}
                                    {column.name.split('_').join(' ').toUpperCase()}
                                </Th>
                            );
                        })}
                        {(permissions || 0) > 1 ? <Th>{/* <CreateColumn columns={columns || []} createColumn={createColumn} /> */}</Th> : null}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows?.map((row: any, rowIndex: number) => {
                        console.log('ROW RENDERED');
                        return (
                            <Tr key={rowIndex}>
                                {(permissions || 0) > 1 ? (
                                    <>
                                        {/* ROW TOOLBAR SECTION ***************************** */}
                                        {/* <Td>
                                            <Flex> */}
                                        {/* <Checkbox
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onDeleteRowCheckboxChange(event, row, index)}
                                                    isChecked={checkboxes[index]}
                                                /> */}
                                        {/* <EditRow cells={row.cells} />
                                                <NoteModal row={row} updateRow={updateRow} rowCallUpdate={rowCallUpdate} />
                                                <Box ml={'10px'} pt={'2px'} cursor={'pointer'} onClick={() => handleReminderClick(row)}>
                                                    <FaRegBell color={row.reminder ? '#16b2fc' : '#b8b8b8'} />
                                                </Box>
                                                <Tooltip openDelay={500} label={!row.acknowledged ? 'Needs acknowledgement' : 'Acknowledged'}>
                                                    <Box ml={'10px'} pt={'2px'} cursor={'pointer'} onClick={() => handleAcknowledgeClick(row)}>
                                                        <FaRegCheckSquare color={!row.acknowledged ? '#ffa507' : '#16b2fc'} />
                                                    </Box>
                                                </Tooltip> */}
                                        {/* </Flex>
                                        </Td> */}
                                        {/* TAGS COLLAPSABLE ******************************************* */}
                                        {/* {showTagsColumn ? (
                                            <Td>
                                                <Box overflow={'revert'}>
                                                    <Flex>
                                                        <TagsModal
                                                            tagType={'row'}
                                                            data={row}
                                                            tags={row.tags}
                                                            update={updateRow}
                                                            workspaceId={dataCollection?.workspace || ''}
                                                        />
                                                        {row.tags !== undefined
                                                            ? row.tags.map((tag: TTag, index: number) => {
                                                                  return (
                                                                      <>
                                                                          <WrapItem key={index}>
                                                                              <Tag size={'sm'} variant="subtle" colorScheme="blue" mr={'5px'} zIndex={1000}>
                                                                                  <TagLabel pb={'2px'}>{tag.name}</TagLabel>
                                                                                  <TagCloseButton
                                                                                      onClick={() => handleCloseTagButtonClick(row, tag)}
                                                                                      zIndex={1000}
                                                                                  />
                                                                              </Tag>
                                                                          </WrapItem>
                                                                      </>
                                                                  );
                                                              })
                                                            : null}
                                                    </Flex>
                                                </Box>
                                            </Td>
                                        ) : null} */}
                                    </>
                                ) : null}
                                {/* CELLS *********************** */}
                                {columnsData?.map((column: TColumn, index: number) => {
                                    const value = row.values[column.name];
                                    return (
                                        <Td key={index} px={column.type == 'label' ? '1px' : '10px'} py={'0'} m={'0'}>
                                            {/* <Text>{row.values[column.name]}</Text> */}
                                            {/* <Tooltip
                                                    label={cell.value}
                                                    openDelay={500}
                                                    isDisabled={isFocused}
                                                    placement={"top"}
                                                > */}
                                            {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                                <Box>
                                                    <LabelMenu row={row} columnName={column.name} labels={column.labels} value={value} />
                                                </Box>
                                            ) : column.type === 'people' ? (
                                                <Box>
                                                    {!((permissions || 0) > 1) ? (
                                                        <Text cursor={'default'}>{value}</Text>
                                                    ) : (
                                                        <Box>
                                                            <PeopleMenu row={row} columnName={column.name} people={column.people || []} value={value} />
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : column.type === 'date' ? (
                                                <Box>{/* <DateInput cell={cell} value={cell.value} permissions={permissions} /> */}</Box>
                                            ) : column.type === 'number' ? (
                                                <Box>{/* <NumberInput cell={cell} value={cell.value} permissions={permissions} /> */}</Box>
                                            ) : column.type === 'upload' ? (
                                                <Box>
                                                    {/* <UploadMenu
                                                            cell={cell}
                                                            addToCell={true}
                                                            // handleDocsChange={handleCellDocsChange}
                                                            handleAddExistingDoc={handleAddExistingDoc}
                                                            // handleAddExistingDocToCell={handleAddExistingDocToCell}
                                                            create={false}
                                                            columnName={column.name}
                                                        /> */}
                                                </Box>
                                            ) : column.type === 'link' ? (
                                                <Box>
                                                    {/* <LinksMenu
                                                            cell={cell}
                                                            // handleAddLinkClick={handleAddLinkClick}
                                                        /> */}
                                                </Box>
                                            ) : (
                                                <Box>
                                                    {/* <TextInput
                                                        row={row}
                                                        columnName={column.name}
                                                        value={value}
                                                        permissions={permissions}
                                                        rowIndex={rowIndex}
                                                        updateRows={updateRows}
                                                    /> */}
                                                </Box>
                                            )}
                                            {/* </Tooltip> */}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                    <Tr>
                        <Td colSpan={columns.length}>
                            <AddRow addRow={addRow} />
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default DataCollectionWorkbench;
