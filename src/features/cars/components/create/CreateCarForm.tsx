import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateCar } from "@/features/cars/hooks/useCreateCar";
import {
  EMPTY_CAR_FORM,
  toCreateCarInput,
  validateCarForm,
  type CarFormErrors,
  type CarFormValues,
} from "@/features/cars/utils/carForm";

type CreateCarFormProps = {
  onDone: () => void;
};

export const CreateCarForm = ({ onDone }: CreateCarFormProps) => {
  const [values, setValues] = useState(EMPTY_CAR_FORM);
  const [errors, setErrors] = useState<CarFormErrors>({});
  const { createCar, loading, errorMessage } = useCreateCar();

  const field = (name: keyof CarFormValues) => ({
    name,
    value: values[name],
    error: Boolean(errors[name]),
    helperText: errors[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCarForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (await createCar(toCreateCarInput(values))) onDone();
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <DialogContent>
        <Stack spacing={2}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField label="Make" required autoFocus {...field("make")} />
          <TextField label="Model" required {...field("model")} />
          <TextField label="Year" required type="number" {...field("year")} />
          <TextField label="Color" required {...field("color")} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="contained" loading={loading}>
          Add car
        </Button>
      </DialogActions>
    </Box>
  );
};
