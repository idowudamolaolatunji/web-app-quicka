import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const SelectStyled = styled(Select)(({ theme }) => ({
    fontSize: 13.6,
    fontWeight: 500,
    fontFamily: 'inherit',

    '&.Mui-focused': {
        borderColor: 'transparent',
        boxShadow: 'none',
    },
    '&:hover': {
        borderColor: 'transparent',
    },
    '& fieldset': {
        borderColor: 'transparent',
    },
    '&:hover fieldset': {
        borderColor: 'transparent',
    },
    '&.MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
            borderWidth: 0,
            boxShadow: 'none',
        },
    },

}));


const MenuStyled = styled(MenuItem)(({ theme }) => ({
    fontSize: 13.6,
    fontWeight: 500,
    fontFamily: 'inherit',
}));


export default function SelectAutoWidthDropdown({ menus, period, setPeriod }) {
    const handleChange = (event) => {
        setPeriod(event.target.value);
    };

    React.useEffect(function () {
        setPeriod(menus[0].value);
    }, [])

    return (
        <FormControl>
            <SelectStyled
                value={period}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                {menus.map(menu => (
                    <MenuStyled key={menu.value} value={`${menu.value}`}>{menu.title}</MenuStyled>
                ))}
            </SelectStyled>
        </FormControl>
    );
}