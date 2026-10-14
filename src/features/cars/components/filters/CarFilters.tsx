import { MenuItem, Stack, TextField } from "@mui/material";
import type { CarFilterValues } from "@/features/cars/hooks/useCarFilters";
import { CAR_SORT_OPTIONS } from "@/features/cars/utils/sortCars";

type CarFiltersProps = {
  filters: CarFilterValues;
  onChange: (name: keyof CarFilterValues, value: string) => void;
};

export const CarFilters = ({ filters, onChange }: CarFiltersProps) => (
  <Stack
    component="form"
    role="search"
    aria-label="Filter cars"
    onSubmit={(event) => event.preventDefault()}
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    sx={{ mb: 3 }}
  >
    <TextField
      label="Search by model"
      type="search"
      value={filters.model}
      onChange={(event) => onChange("model", event.target.value)}
      sx={{ flex: 2 }}
    />
    <TextField
      label="Year"
      type="number"
      value={filters.year}
      onChange={(event) => onChange("year", event.target.value)}
      sx={{ flex: 1 }}
    />
    <TextField
      select
      label="Sort by"
      value={filters.sort}
      onChange={(event) => onChange("sort", event.target.value)}
      sx={{ flex: 1 }}
    >
      {CAR_SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Stack>
);
