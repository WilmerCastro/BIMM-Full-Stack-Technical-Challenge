import userEvent from "@testing-library/user-event";
import { graphql, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import {
  renderWithProviders,
  screen,
  waitFor,
  within,
} from "@/test/renderWithProviders";
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

describe("CarsPage – adding a car", () => {
  const openForm = async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByRole("heading", { name: "Audi Q5" });
    await user.click(screen.getByRole("button", { name: "Add car" }));
    const dialog = await screen.findByRole("dialog", { name: "Add a car" });
    return { user, dialog: within(dialog) };
  };

  it("shows field errors and keeps the dialog open when submitted empty", async () => {
    const { user, dialog } = await openForm();

    await user.click(dialog.getByRole("button", { name: "Add car" }));

    expect(dialog.getByText("Make is required")).toBeInTheDocument();
    expect(dialog.getByText("Model is required")).toBeInTheDocument();
    expect(dialog.getByRole("textbox", { name: /make/i })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("adds the new car to the list and closes the dialog", async () => {
    const { user, dialog } = await openForm();

    await user.type(dialog.getByRole("textbox", { name: /make/i }), "Ford");
    await user.type(dialog.getByRole("textbox", { name: /model/i }), "Mustang");
    await user.type(dialog.getByRole("spinbutton", { name: /year/i }), "1967");
    await user.type(dialog.getByRole("textbox", { name: /color/i }), "Red");
    await user.click(dialog.getByRole("button", { name: "Add car" }));

    expect(
      await screen.findByRole("heading", { name: "Ford Mustang" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("shows the API's validation error and keeps what the user typed", async () => {
    server.use(
      graphql.mutation("CreateCar", () =>
        HttpResponse.json({
          errors: [
            {
              message: "make and model are required",
              extensions: { code: "BAD_USER_INPUT" },
            },
          ],
        })
      )
    );
    const { user, dialog } = await openForm();

    await user.type(dialog.getByRole("textbox", { name: /make/i }), "Ford");
    await user.type(dialog.getByRole("textbox", { name: /model/i }), "Mustang");
    await user.type(dialog.getByRole("spinbutton", { name: /year/i }), "1967");
    await user.type(dialog.getByRole("textbox", { name: /color/i }), "Red");
    await user.click(dialog.getByRole("button", { name: "Add car" }));

    expect(
      await dialog.findByText(
        "The car was rejected: make and model are required."
      )
    ).toBeInTheDocument();
    expect(dialog.getByRole("textbox", { name: /make/i })).toHaveValue("Ford");
    expect(screen.queryByText("Ford Mustang")).not.toBeInTheDocument();
  });
});

describe("CarsPage – searching and sorting", () => {
  const carNames = () =>
    screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

  const searchBox = () =>
    screen.getByRole("searchbox", { name: "Search by model" });

  const trackGetCarsRequests = () => {
    const requests: unknown[] = [];
    server.use(
      graphql.query("GetCars", ({ variables }) => {
        requests.push(variables);
      })
    );
    return requests;
  };

  const afterDebounce = { timeout: 2000 };

  it("applies the filters in the URL on load", async () => {
    renderWithProviders(<CarsPage />, { route: "/?model=q&sort=model-asc" });

    expect(
      await screen.findByRole("heading", { name: "Audi Q3" })
    ).toBeInTheDocument();
    expect(carNames()).toEqual(["Audi Q3", "Audi Q5"]);
    expect(searchBox()).toHaveValue("q");
  });

  it("waits for the user to stop typing before searching", async () => {
    const requests = trackGetCarsRequests();
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByRole("heading", { name: "Audi Q5" });

    await user.type(searchBox(), "q5");

    await waitFor(() => expect(carNames()).toEqual(["Audi Q5"]), afterDebounce);
    expect(requests).toEqual([{}, { model: "q5" }]);
  });

  it("explains an empty search and lets the user clear it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />, { route: "/?model=zzz" });

    expect(
      await screen.findByText("No cars match your filters")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(
      () => expect(screen.getAllByRole("listitem")).toHaveLength(6),
      afterDebounce
    );
    expect(searchBox()).toHaveValue("");
  });

  it("filters by year", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByRole("heading", { name: "Audi Q5" });

    await user.type(screen.getByRole("spinbutton", { name: "Year" }), "2024");

    await waitFor(
      () => expect(carNames()).toEqual(["Audi R8", "Audi Q3"]),
      afterDebounce
    );
  });

  it("re-sorts the list without asking the API again", async () => {
    const requests = trackGetCarsRequests();
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByRole("heading", { name: "Audi Q5" });
    expect(carNames()[0]).toBe("Audi e-tron GT");

    await user.click(screen.getByRole("combobox", { name: "Sort by" }));
    await user.click(screen.getByRole("option", { name: "Model A–Z" }));

    expect(carNames()).toEqual([
      "Audi A3",
      "Audi A6",
      "Audi e-tron GT",
      "Audi Q3",
      "Audi Q5",
      "Audi R8",
    ]);
    expect(requests).toHaveLength(1);
  });
});
