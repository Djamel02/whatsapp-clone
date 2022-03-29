import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MoreVert } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function CustomVerticalMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleClose}>New Group</MenuItem>
        <MenuItem onClick={handleClose}>Create a room</MenuItem>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Archived</MenuItem>
        <MenuItem onClick={handleClose}>Starred messages</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
      </Menu>
    </>
  );
}
