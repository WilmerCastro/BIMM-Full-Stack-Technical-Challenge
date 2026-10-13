export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

type CarImages = Pick<Car, "mobile" | "tablet" | "desktop">;

export type CreateCarInput = Omit<Car, "id" | keyof CarImages> &
  Partial<CarImages>;
