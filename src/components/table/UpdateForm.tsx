import { useCallback, useEffect, useState } from 'react';
import { Box, Card, CardBody, CardHeader, Center, Container, Flex, Spacer, Text } from '@chakra-ui/react';
import { useGetFormDataQuery, useGetRowQuery, useGetUserQuery, useUpdateFormDataMutation } from '../../app/services/api';
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
    console.log({ id, dataCollectionId });
    console.log(localStorage.getItem('workspaceId'));
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: formData } = useGetFormDataQuery(dataCollectionId);
    const { data: rowData } = useGetRowQuery({ workspaceId: id, dataCollectionId, rowId });
    const [updateFormData] = useUpdateFormDataMutation();

    const [row, setRow] = useState<any>(formData?.row || {});
    const [columns, setColumns] = useState<any>(formData?.columns);
    const [dataCollection, setDataCollection] = useState<any>(formData?.dataCollection);

    const [_, setPermissions] = useState<number>();

    useEffect(() => {
        console.log(rowData);
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
            console.log(value);
            setRow({ ...row, values: { ...row.values, [columnName]: value } });
        },
        [row]
    );

    const onRefChange = (columnName: string, ref: any) => {
        console.log(ref);
        const refs: any = [];
        if (row !== null && row.refs === undefined) {
            console.log(row.refs);
            refs.push(ref);
            console.log({ ...row, refs: { [columnName]: refs } });
            setRow({ ...row, refs: { [columnName]: refs } });
        } else {
            if (row !== null && row.refs[columnName] === undefined) {
                console.log({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
                setRow({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
            } else {
                console.log({ ...row, refs: { ...row.refs, [columnName]: [...row.refs[columnName], ref] } });
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

    const updateData = async () => {
        console.log(row);
        await updateFormData(row);
    };
    return (
        <>
            <Container>
                <Card mt={'60px'}>
                    <>{console.log(dataCollection)}</>
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
                                console.log(row);
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
                                                />
                                            ) : column.type === 'people' ? (
                                                <PeopleMenu
                                                    columnName={column.name}
                                                    people={column.people}
                                                    value={row && row.values[column.name] !== undefined ? row.values[column.name] : ''}
                                                    onChange={onChange}
                                                    allowed={true}
                                                />
                                            ) : column.type === 'date' ? (
                                                <DateInput
                                                    value={row && row.values[column.name] !== undefined ? row.values[column.name] : ''}
                                                    columnName={column.name}
                                                    onChange={onChange}
                                                    allowed={true}
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
                                                                refs={
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
                            <PrimaryButton onClick={updateData}>SUBMIT</PrimaryButton>
                        </Flex>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
};

export default UpdateForm;
