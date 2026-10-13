import { Card, CardContent, Typography } from "@mui/material";
import type { Car } from "../types/car";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" component="h2">
        {car.make} {car.model}
      </Typography>
      <Typography color="text.secondary">
        {car.year} · {car.color}
      </Typography>
    </CardContent>
  </Card>
);
