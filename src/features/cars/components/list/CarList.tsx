import { Box } from "@mui/material";
import type { Car } from "@/features/cars/types/car";
import { CarCard } from "./CarCard";

type CarListProps = {
  cars: Car[];
};

export const CarList = ({ cars }: CarListProps) => (
  <Box
    component="ul"
    sx={{
      listStyle: "none",
      m: 0,
      p: 0,
      display: "grid",
      gap: 2,
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      },
    }}
  >
    {cars.map((car) => (
      <li key={car.id}>
        <CarCard car={car} />
      </li>
    ))}
  </Box>
);
