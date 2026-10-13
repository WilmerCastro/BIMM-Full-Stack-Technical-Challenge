import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCars } from "@/features/cars/hooks/useCars";
import { CarList } from "./CarList";

export const CarResults = () => {
  const { cars, loading, error, retry } = useCars();

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
    return (
      <EmptyState
        title="No cars yet"
        description="Cars you add will show up here."
      />
    );
  }

  return <CarList cars={cars} />;
};
