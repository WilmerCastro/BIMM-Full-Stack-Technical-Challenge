import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { useCar } from "@/features/cars/hooks/useCar";

const toListPath = (state: unknown) =>
  typeof state === "object" &&
  state !== null &&
  "listSearch" in state &&
  typeof state.listSearch === "string"
    ? `/${state.listSearch}`
    : "/";

export const CarDetailPage = () => {
  const { id = "" } = useParams();
  const listPath = toListPath(useLocation().state);
  const { car, loading, error, retry } = useCar(id);

  const backLink = (
    <Button component={RouterLink} to={listPath}>
      Back to cars
    </Button>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress aria-label="Loading car" />
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
        We couldn't load this car.
      </Alert>
    );
  }

  if (!car) {
    return (
      <EmptyState
        title="Car not found"
        description="It may have been removed, or the link is wrong."
        action={backLink}
      />
    );
  }

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
      {backLink}
      <Card variant="outlined" sx={{ width: "100%" }}>
        <ResponsiveImage
          mobile={car.mobile}
          tablet={car.tablet}
          desktop={car.desktop}
          alt={`${car.color} ${car.year} ${car.make} ${car.model}`}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {car.make} {car.model}
          </Typography>
          <Typography>Year: {car.year}</Typography>
          <Typography>Color: {car.color}</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};
