"use client"
import React, { useState, ReactNode } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from '@mui/material';

// Field Definition Type
type FieldType = 'text' | 'number' | 'email' | 'date';

interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  validation?: (value: any) => boolean;
}

// Methods Interface
interface CrudMethods {
  createOne: (data: any) => Promise<any>;
  updateOne: (id: string, data: any) => Promise<any>;
  deleteOne: (id: string) => Promise<any>;
  fetchAll?: () => Promise<any[]>;
}

// Slots Interface for Custom Rendering
interface CrudSlots {
  createOne?: React.ComponentType<{ onClose: () => void }>;
  updateOne?: React.ComponentType<{ 
    data: any, 
    onClose: () => void 
  }>;
  list?: React.ComponentType<{ 
    data: any[], 
    onEdit: (item: any) => void, 
    onDelete: (id: string) => void 
  }>;
}

// Main CRUD Component
const Crud: React.FC<{
  fields: FieldDefinition[];
  methods: CrudMethods;
  slots?: CrudSlots;
}> = ({ 
  fields, 
  methods, 
  slots 
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Default List Component
  const DefaultListComponent = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {fields.map(field => (
              <TableCell key={field.name}>{field.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              {fields.map(field => (
                <TableCell key={field.name}>{item[field.name]}</TableCell>
              ))}
              <TableCell>
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Default Create/Update Component
  const DefaultFormComponent = ({ 
    data: itemData, 
    onClose 
  }: { 
    data?: any, 
    onClose: () => void 
  }) => {
    const [formData, setFormData] = useState(itemData || {});

    const handleSubmit = async () => {
      try {
        if (itemData) {
          await methods.updateOne(itemData.id, formData);
        } else {
          await methods.createOne(formData);
        }
        onClose();
      } catch (error) {
        console.error('Submit error', error);
      }
    };

    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>{itemData ? 'Update' : 'Create'}</DialogTitle>
        <DialogContent>
          {fields.map(field => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({
                ...formData,
                [field.name]: e.target.value
              })}
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {itemData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
  };

  const handleDelete = async (id: string) => {
    await methods.deleteOne(id);
    // Refresh data
    methods.fetchAll?.().then(setData);
  };

  // Render list component
  const ListComponent = slots?.list || DefaultListComponent;
  const CreateComponent = slots?.createOne || DefaultFormComponent;
  const UpdateComponent = slots?.updateOne || DefaultFormComponent;

  return (
    <div>
      <Button onClick={() => setIsCreateOpen(true)}>
        Create New
      </Button>

      <ListComponent 
        data={data} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isCreateOpen && (
        <CreateComponent 
          onClose={() => setIsCreateOpen(false)} 
        />
      )}

      {selectedItem && (
        <UpdateComponent
          data={selectedItem}
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default Crud;