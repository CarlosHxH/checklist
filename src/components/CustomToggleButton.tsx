"use client"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type Props = {
  name: string;
  items: string[];
  onChange?: (value: { [x: string]: string; }) => void; // Adjusted type for onChange
}

export default function CustomToggleButton(props: Props): React.JSX.Element {
  const [select, setSelect] = React.useState<string | null>(null); // Use string | null for initial state

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue !== null) {
      setSelect(newValue);
      if (props.onChange) {
        props.onChange({[props.name]:newValue});
      }
    }
  };

  return (
    <ToggleButtonGroup
      fullWidth
      color="primary"
      exclusive
      aria-label={props.name}
      value={select}
      onChange={handleChange}
    >
      {props.items && props.items.map((txt) => (
        <ToggleButton
          key={txt.toLowerCase()}
          value={txt.toLowerCase()}
          sx={{ bgcolor: select === txt.toLowerCase() ? 'primary' : 'secondary' }} // Use theme colors
        >
          {txt}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}