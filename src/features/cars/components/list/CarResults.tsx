import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCars, type CarQuery } from "@/features/cars/hooks/useCars";
import { CarList } from "./CarList";

type CarResultsProps = {
  query: CarQuery;
  isFiltered: boolean;
  onClearFilters: () => void;
};

export const CarResults = ({
  query,
  isFiltered,
  onClearFilters,
}: CarResultsProps) => {
  const { cars, loading, updating, error, retry } = useCars(query);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress aria-label="Loading cars" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={retry}>
            Retry
          </Button>
        }
      >
        We couldn't load the cars.
      </Alert>
    );
  }

  if (cars.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="No cars match your filters"
        description="Try another model or year."
        action={<Button onClick={onClearFilters}>Clear filters</Button>}
      />
    ) : (
      <EmptyState
        title="No cars yet"
        description="Cars you add will show up here."
      />
    );
  }

  return (
    <>
      {updating && (
        <LinearProgress aria-label="Updating cars" sx={{ mb: 2 }} />
      )}
      <CarList cars={cars} />
    </>
  );
};
