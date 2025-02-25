import { useCallback, useEffect, useState } from 'react';
import { Box, Card, CardBody, CardHeader, Center, Container, Flex, Spacer, Spinner, Text, useToast } from '@chakra-ui/react';
import { useGetFormDataQuery, useGetRowQuery, useGetUserQuery, useUpdateRowMutation } from '../../app/services/api';
import LabelMenu from '../../features/dataCollections/LabelMenu';
import PeopleMenu from '../../features/dataCollections/PeopleMenu';
import DateInput from '../../features/dataCollections/DateInput';
import TextInput from '../../features/dataCollections/TextInput';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Reference from './Reference';
import PrimaryButton from '../Buttons/PrimaryButton';

const UpdateForm = () => {
    const { id, dataCollectionId, rowId } = useParams();
    const navigate = useNavigate();
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: formData } = useGetFormDataQuery(dataCollectionId);
    const { data: rowData } = useGetRowQuery({ workspaceId: id, dataCollectionId, rowId });
    // const [updateFormData] = useUpdateFormDataMutation();
    const [updateRow, { isLoading, isSuccess, isError }] = useUpdateRowMutation();

    const [row, setRow] = useState<any>(rowData);
    const [columns, setColumns] = useState<any>(formData?.columns);
    const [dataCollection, setDataCollection] = useState<any>(formData?.dataCollection);

    const toast = useToast();

    const [_, setPermissions] = useState<number>();

    useEffect(() => {
        if (rowData === null) {
            navigate(`/workspaces/${id}/dataCollections/${dataCollectionId}/form`);
        }
        setRow(rowData);
        setColumns(formData?.columns);
        setDataCollection(formData?.dataCollection);
    }, [formData, rowData]);

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

    const onChange = useCallback(
        (columnName: string, value: string) => {
            setRow({ ...row, values: { ...row.values, [columnName]: value } });
        },
        [row]
    );

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (row !== null && row.refs === undefined) {
            refs.push(ref);
            setRow({ ...row, refs: { [columnName]: refs } });
        } else {
            if (row !== null && row.refs[columnName] === undefined) {
                setRow({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
            } else {
                setRow({ ...row, refs: { ...row.refs, [columnName]: [...row.refs[columnName], ref] } });
            }
        }
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = row;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        setRow({ ...row, refs: { ...row.refs, [columnName]: filteredRefs } });
    };

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Saved!',
                description: '',
                status: 'success',
                duration: 4000,
                position: 'bottom-right',
                isClosable: true,
            });
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast({
                title: 'Error',
                description: 'Try again.',
                status: 'error',
                duration: 4000,
                position: 'bottom-right',
                isClosable: true,
            });
        }
    }, [isError]);

    const updateData = async () => {
        updateRow(row);
    };
    return (
        <>
            <Container>
                <Card mt={'60px'}>
                    <CardHeader>
                        <Center>{dataCollection !== undefined ? dataCollection.name : null}</Center>
                        <Center>
                            <Text fontSize={'12px'} color={'gray'}>
                                {user ? null : 'Login to view all the fields in this form.'}
                            </Text>
                        </Center>
                        <Center>
                            <Text fontSize={'12px'} color={'gray'}>
                                {user ? null : <Link to={'/login'}>Login</Link>}
                            </Text>
                        </Center>
                    </CardHeader>
                    <CardBody>
                        {columns?.map((column: any, columnIndex: number) => {
                            if (column.includeInForm) {
                                return (
                                    <div
                                        key={columnIndex}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            fontSize: '12px',
                                        }}
                                    >
                                        <Box pb={'15px'}>
                                            {column.type !== 'reference' ? (
                                                <Text mb={'8px'} fontSize={'13px'}>{`${column.name[0].toUpperCase()}${column.name
                                                    .slice(1, column.name.length)
                                                    .split('_')
                                                    .join(' ')}`}</Text>
                                            ) : null}
                                            {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                                <LabelMenu
                                                    id={0}
                                                    labels={column.labels}
                                                    columnName={column.name}
                                                    value={row && row.values[column.name] !== undefined ? row.values[column.name] : ''}
                                                    onChange={onChange}
                                                    allowed={true}
                                                    border={'1px solid #f1f3f5'}
                                                />
                                            ) : column.type === 'people' ? (
                                                <PeopleMenu
                                                    columnName={column.name}
                                                    people={column.people}
                                                    values={row && row.values[column.name] !== undefined ? row.values[column.name] : []}
                                                    onChange={onChange}
                                                    allowed={true}
                                                    border={'1px solid #f1f3f5'}
                                                />
                                            ) : column.type === 'date' ? (
                                                <DateInput
                                                    value={row && row.values[column.name] !== undefined ? row.values[column.name] : ''}
                                                    columnName={column.name}
                                                    onChange={onChange}
                                                    allowed={true}
                                                    border={'1px solid #f1f3f5'}
                                                />
                                            ) : column.type === 'reference' ? (
                                                <>
                                                    {user ? (
                                                        <>
                                                            <Text mb={'8px'} fontSize={'13px'}>{`${column.name[0].toUpperCase()}${column.name
                                                                .slice(1, column.name.length)
                                                                .split('_')
                                                                .join(' ')}`}</Text>
                                                            <Reference
                                                                column={column !== undefined ? column : {}}
                                                                refsProp={
                                                                    row && row.refs !== undefined && row.refs[column.name] !== undefined
                                                                        ? row.refs[column.name]
                                                                        : []
                                                                }
                                                                onRefChange={onRefChange}
                                                                onRemoveRef={onRemoveRef}
                                                                allowed={true}
                                                            />
                                                        </>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <TextInput
                                                    id={''}
                                                    columnName={column.name}
                                                    value={row && row.values[column.name] !== undefined ? row.values[column.name] : ''}
                                                    type="form"
                                                    onChange={onChange}
                                                    allowed={true}
                                                    isTextarea={false}
                                                />
                                            )}
                                        </Box>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <Flex mt={'10px'} width={'full'}>
                            <Spacer />
                            <PrimaryButton onClick={updateData}>{isLoading ? <Spinner /> : 'UPDATE'}</PrimaryButton>
                        </Flex>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
};

export default UpdateForm;
