import { Card, CardContent, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { Car } from "@/features/cars/types/car";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => {
  const { search } = useLocation();

  return (
    <Card variant="outlined" sx={{ height: "100%", position: "relative" }}>
      <ResponsiveImage
        mobile={car.mobile}
        tablet={car.tablet}
        desktop={car.desktop}
        alt={`${car.color} ${car.year} ${car.make} ${car.model}`}
      />
      <CardContent>
        <Typography variant="h6" component="h2">
          <Link
            component={RouterLink}
            to={`/cars/${car.id}`}
            state={{ listSearch: search }}
            color="inherit"
            underline="hover"
            sx={{ "&::after": { content: '""', position: "absolute", inset: 0 } }}
          >
            {car.make} {car.model}
          </Link>
        </Typography>
        <Typography color="text.secondary">
          {car.year} · {car.color}
        </Typography>
      </CardContent>
    </Card>
  );
};
