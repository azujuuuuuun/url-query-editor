/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders buttons", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Add" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Send" })).not.toBeNull();
  });

  test("click add and delete button", () => {
    render(<App />);

    expect(screen.queryByRole("textbox")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getAllByRole("textbox").length).toBe(2);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByRole("textbox")).toBeNull();
  });

  test("update key and value", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByLabelText<HTMLInputElement>("Key of 1 row").value).toBe(
      ""
    );
    expect(
      screen.getByLabelText<HTMLInputElement>("Value of 1 row").value
    ).toBe("");

    fireEvent.change(screen.getByLabelText("Key of 1 row"), {
      target: { value: "key" },
    });
    fireEvent.change(screen.getByLabelText("Value of 1 row"), {
      target: { value: "value" },
    });

    expect(screen.getByLabelText<HTMLInputElement>("Key of 1 row").value).toBe(
      "key"
    );
    expect(
      screen.getByLabelText<HTMLInputElement>("Value of 1 row").value
    ).toBe("value");
  });
});
