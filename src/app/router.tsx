import { CarDetailPage } from "@/features/cars/pages/CarDetailPage";
import { CarsPage } from "@/features/cars/pages/CarsPage";
import { Brief } from "@/pages/Brief";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout";

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<CarsPage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
    </Route>
    <Route path="/brief" element={<Brief />} />
  </Routes>
);

export const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
