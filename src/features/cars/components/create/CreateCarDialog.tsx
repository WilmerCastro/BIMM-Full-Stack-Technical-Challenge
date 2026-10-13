import { Dialog, DialogTitle } from "@mui/material";
import { CreateCarForm } from "./CreateCarForm";

type CreateCarDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateCarDialog = ({ open, onClose }: CreateCarDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Add a car</DialogTitle>
    <CreateCarForm onDone={onClose} />
  </Dialog>
);
