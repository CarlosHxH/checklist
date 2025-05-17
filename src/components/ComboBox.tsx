import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Control, useController } from 'react-hook-form';

interface Option {
  label: string;
  value: string;
}

interface ComboBoxProps {
  options: Option[];
  label: string;
  name: string;
  control: Control<any>;
  rules?: Record<string, any>;
  disabled?: boolean;
  defaultValue?: string | Option[];
}

export default function ComboBox({ options, label,  name, control, rules, disabled, defaultValue}: ComboBoxProps) {
  const { field: { onChange, value }, fieldState: { error }} = useController({ name, control, rules});

  const selectedOption = React.useMemo(() => 
    options.find(option => option.value === value || option.value === defaultValue) || null,
    [value, options,defaultValue]
  );

  return (
    <Autocomplete
      disabled={!!disabled}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.value || null)}
      options={options}
      getOptionLabel={(option) => option.label}
      fullWidth
      size='small'
      renderInput={(params) => (<TextField {...params} label={label} error={!!error} helperText={error?.message}/>)}
    />
  );
}