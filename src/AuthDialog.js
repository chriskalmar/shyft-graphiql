import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { authenticate, clearAuthentication } from './auth';

export default function AuthDialog({
  onClose = () => {},
  isOpen = false,
  fetcher,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
    }
  }, [isOpen]);

  useEffect(() => {
    setAuthError(false);
  }, [username, password]);

  const onClearAuth = () => {
    clearAuthentication();
    onClose();
  };

  const onLogIn = async () => {
    const [success, error] = await authenticate(fetcher, username, password);
    if (error === 'AuthenticationError') {
      setAuthError(true);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="auth-dialog-title">
      <DialogTitle id="auth-dialog-title">Authentication</DialogTitle>
      <DialogContent>
        <from>
          <Box mb={2}>
            <TextField
              autoFocus
              id="username"
              label="Username"
              type="text"
              variant="outlined"
              fullWidth
              onChange={(event) => setUsername(event.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              autoFocus
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
            />
          </Box>
          {authError && <Alert severity="error">Authentication failed!</Alert>}
          {!authError && <Box p={3} />}
        </from>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={onClearAuth} variant="outlined" color="secondary">
          Clear Authentication
        </Button>
        <Button onClick={onLogIn} variant="contained" color="primary">
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
