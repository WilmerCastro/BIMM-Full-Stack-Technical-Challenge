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
