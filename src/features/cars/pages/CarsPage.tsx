import { Typography } from "@mui/material";
import { CarResults } from "../components/CarResults";

export const CarsPage = () => (
  <>
    <Typography variant="h4" component="h1" gutterBottom>
      Cars
    </Typography>
    <CarResults />
  </>
);
