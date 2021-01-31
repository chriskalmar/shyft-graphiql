import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AuthDialog({ onClose = () => {}, isOpen = false }) {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="auth-dialog-title">
      <DialogTitle id="auth-dialog-title">Authentication</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="username"
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
        />
        <TextField
          autoFocus
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Clear Authentication
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
