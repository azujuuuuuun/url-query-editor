import App from "./App";
/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  test("renders buttons", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Add" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Send" })).not.toBeNull();
  });

  test("click add and delete button", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.queryByRole("textbox")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getAllByRole("textbox").length).toBe(2);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByRole("textbox")).toBeNull();
  });

  test("update key and value", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByLabelText<HTMLInputElement>("Key of 1 row").value).toBe(
      "",
    );
    expect(
      screen.getByLabelText<HTMLInputElement>("Value of 1 row").value,
    ).toBe("");

    await user.type(screen.getByLabelText("Key of 1 row"), "key");
    await user.type(screen.getByLabelText("Value of 1 row"), "value");

    expect(screen.getByLabelText<HTMLInputElement>("Key of 1 row").value).toBe(
      "key",
    );
    expect(
      screen.getByLabelText<HTMLInputElement>("Value of 1 row").value,
    ).toBe("value");
  });
});
