import { Card, CardContent, Typography } from "@mui/material";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { Car } from "@/features/cars/types/car";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <ResponsiveImage
      mobile={car.mobile}
      tablet={car.tablet}
      desktop={car.desktop}
      alt={`${car.color} ${car.year} ${car.make} ${car.model}`}
    />
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
