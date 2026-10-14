import userEvent from "@testing-library/user-event";
import { graphql, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import {
  renderWithProviders,
  screen,
  waitFor,
} from "@/test/renderWithProviders";
import { CreateCarForm } from "./CreateCarForm";

const fillAndSubmit = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: /make/i }), "Ford");
  await user.type(screen.getByRole("textbox", { name: /model/i }), "Mustang");
  await user.type(screen.getByRole("spinbutton", { name: /year/i }), "1967");
  await user.type(screen.getByRole("textbox", { name: /color/i }), "Red");
  await user.click(screen.getByRole("button", { name: "Add car" }));
};

describe("CreateCarForm", () => {
  it("finishes once the car is saved", async () => {
    const onDone = jest.fn();
    renderWithProviders(<CreateCarForm onDone={onDone} />);

    await fillAndSubmit();

    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
  });

  it("stays open with the API's error when the car is rejected", async () => {
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
    const onDone = jest.fn();
    renderWithProviders(<CreateCarForm onDone={onDone} />);

    await fillAndSubmit();

    expect(
      await screen.findByText(
        "The car was rejected: make and model are required."
      )
    ).toBeInTheDocument();
    expect(onDone).not.toHaveBeenCalled();
  });
});
