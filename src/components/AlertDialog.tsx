import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { SetStateAction } from 'jotai';
import React, { Dispatch } from 'react';

interface Props {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  onConfirm: () => void;
}

export default function AlertDialog({
  isOpened,
  setIsOpened,
  title,
  description,
  onConfirm,
}: Props) {
  return (
    <Dialog open={isOpened} onClose={() => setIsOpened(false)}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpened(false)}>아니오</Button>
        <Button onClick={onConfirm} autoFocus>
          예
        </Button>
      </DialogActions>
    </Dialog>
  );
}
