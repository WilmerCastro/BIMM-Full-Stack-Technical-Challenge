import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CreateCarDialog } from "@/features/cars/components/create/CreateCarDialog";
import { CarFilters } from "@/features/cars/components/filters/CarFilters";
import { CarResults } from "@/features/cars/components/list/CarResults";
import { useCarFilters } from "@/features/cars/hooks/useCarFilters";

export const CarsPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { filters, query, isFiltered, setFilter, clearFilters } =
    useCarFilters();

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
      <CarFilters filters={filters} onChange={setFilter} />
      <CarResults
        query={query}
        isFiltered={isFiltered}
        onClearFilters={clearFilters}
      />
      <CreateCarDialog
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </>
  );
};
