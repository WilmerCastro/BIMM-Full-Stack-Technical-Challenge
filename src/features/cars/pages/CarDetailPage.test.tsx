import userEvent from "@testing-library/user-event";
import { graphql, HttpResponse } from "msw";
import { AppRoutes } from "@/app/router";
import { server } from "@/mocks/server";
import { renderWithProviders, screen } from "@/test/renderWithProviders";

describe("CarDetailPage", () => {
  it("shows the car's details", async () => {
    renderWithProviders(<AppRoutes />, { route: "/cars/1" });

    expect(
      await screen.findByRole("heading", { level: 1, name: "Audi Q5" })
    ).toBeInTheDocument();
    expect(screen.getByText("Color: Glacier White")).toBeInTheDocument();
  });

  it("says when the car does not exist", async () => {
    renderWithProviders(<AppRoutes />, { route: "/cars/999" });

    expect(await screen.findByText("Car not found")).toBeInTheDocument();
  });

  it("shows an error and recovers when the user retries", async () => {
    server.use(
      graphql.query(
        "GetCar",
        () => HttpResponse.json({ errors: [{ message: "boom" }] }),
        { once: true }
      )
    );
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: "/cars/1" });

    await user.click(await screen.findByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Audi Q5" })
    ).toBeInTheDocument();
  });

  it("goes back to the same search it was opened from", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: "/?model=q" });

    await user.click(await screen.findByRole("link", { name: "Audi Q5" }));
    await user.click(await screen.findByRole("link", { name: "Back to cars" }));

    expect(
      await screen.findByRole("searchbox", { name: "Search by model" })
    ).toHaveValue("q");
  });
});
