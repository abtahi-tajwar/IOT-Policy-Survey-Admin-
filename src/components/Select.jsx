import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import MuiSelect from '@mui/material/Select';

export default function Select({ label, options, value, setValue }) {
  
  const handleChange = (event) => {
    if (setValue) {
        setValue(event.target.value)
    }
  };

  return (
    <FormControl sx={{ minWidth: 120, width: '100%' }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <MuiSelect
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label="Age"
        onChange={handleChange}
      >
        {options.map((option, oi) => (
            <MenuItem value={option.value ?? oi} key={oi}>
                {option.label ?? option}
            </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}