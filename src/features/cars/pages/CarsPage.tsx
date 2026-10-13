import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CarResults } from "@/features/cars/components/list/CarResults";
import { CreateCarDialog } from "@/features/cars/components/create/CreateCarDialog";

export const CarsPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h4" component="h1">
          Cars
        </Typography>
        <Button variant="contained" onClick={() => setIsCreating(true)}>
          Add car
        </Button>
      </Stack>
      <CarResults />
      <CreateCarDialog
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </>
  );
};
