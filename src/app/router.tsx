import { CarsPage } from "@/features/cars/pages/CarsPage";
import { Brief } from "@/pages/Brief";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CarsPage />} />
      </Route>
      <Route path="/brief" element={<Brief />} />
    </Routes>
  </BrowserRouter>
);
