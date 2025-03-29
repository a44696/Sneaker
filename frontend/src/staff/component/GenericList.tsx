import { List, Datagrid, TextField, NumberField,  DateField, EditButton, DeleteButton, SearchInput, TopToolbar, Pagination, FunctionField } from 'react-admin';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface FieldProps {
    source: string;
    label?: string;
    type?: 'text' | 'number' | 'date' | 'image' | 'array';
}

interface GenericListProps {
    resource: string;
    title: string;
    fields: FieldProps[];
}

// Bộ lọc tìm kiếm


// Nút "Add New"
const ListActions = ({ title, resource }: { title: string; resource: string }) => (
    <TopToolbar>
        {['product', 'category'].includes(resource) && (
            <Button variant="contained" color="primary" component={Link} to={`/${resource}/create`}>
                Add New {title}
            </Button>
        )}
    </TopToolbar>
);

const GenericList = ({ resource, title, fields }: GenericListProps) => {
    // Bộ lọc tìm kiếm
    const listFilters = [
        <SearchInput key="search" source="q" alwaysOn placeholder="Search..." />,
    ];
    
    return (
        <List
            perPage={10}
            resource={resource}
            filters={listFilters}
            actions={<ListActions title={title} resource={resource} />}
            pagination={<Pagination />}
        >
            <Datagrid rowClick={false}>
                {fields.map((field) => {
                    switch (field.type) {
                        case 'number':
                            return <NumberField key={field.source} source={field.source} label={field.label || field.source} />;
                        case 'date':
                            return <DateField key={field.source} source={field.source} label={field.label || field.source} />;
                            case 'image':
                                return resource === "user" ? (
                                    <FunctionField
                                        key={field.source}
                                        label={field.label || field.source}
                                        render={(record) =>
                                            record[field.source] ? (
                                                <img
                                                    src={record[field.source]}
                                                    alt="User Avatar"
                                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )
                                        }
                                    />
                                ) : (
                                    <FunctionField
                                        key={field.source}
                                        label={field.label || field.source}
                                        render={(record) =>
                                            record[field.source] && record[field.source].length > 0 ? (
                                                <img
                                                    src={record[field.source][0]} // Lấy ảnh đầu tiên trong danh sách
                                                    alt="Product"
                                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )
                                        }
                                    />
                                );
                            
                        default:
                            return <TextField key={field.source} source={field.source} label={field.label || field.source} />;
                    }
                })}
                
              <FunctionField
                    label=""
                    sx={{ textAlign: 'center' }}
                    render={(record) =>{
                       
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                
                                
                                <EditButton record={record} />
                                <DeleteButton record={record} />
                            </div>
                        )
                    }}
                />
            </Datagrid>
        </List>
    );
};

export default GenericList;
