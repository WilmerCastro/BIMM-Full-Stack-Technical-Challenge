import userEvent from "@testing-library/user-event";
import { graphql, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { renderWithProviders, screen } from "@/test/renderWithProviders";
import { CarsPage } from "./CarsPage";

describe("CarsPage", () => {
  it("shows a loading indicator and then the list of cars", async () => {
    renderWithProviders(<CarsPage />);

    expect(
      screen.getByRole("progressbar", { name: "Loading cars" })
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: "Audi Q5" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no cars", async () => {
    server.use(
      graphql.query("GetCars", () => HttpResponse.json({ data: { cars: [] } }))
    );

    renderWithProviders(<CarsPage />);

    expect(await screen.findByText("No cars yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows an error and recovers when the user retries", async () => {
    server.use(
      graphql.query(
        "GetCars",
        () => HttpResponse.json({ errors: [{ message: "boom" }] }),
        { once: true }
      )
    );
    const user = userEvent.setup();

    renderWithProviders(<CarsPage />);

    expect(
      await screen.findByText("We couldn't load the cars.")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("heading", { name: "Audi Q5" })
    ).toBeInTheDocument();
    expect(
      screen.queryByText("We couldn't load the cars.")
    ).not.toBeInTheDocument();
  });
});
