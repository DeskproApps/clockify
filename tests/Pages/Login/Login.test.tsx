import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import { Login } from "../../../src/pages/Login/Login";
import React from "react";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Login />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getWorkspaces: jest.fn(() => [
      {
        id: "1",
        name: "workspace",
      },
    ]),
  };
});

jest.mock("../../../src/styles", () => {
  return {
    StyledLink: "a",
  };
});

describe("Login Page", () => {
  test("Login should work correctly", async () => {
    const { getByTestId, getByText } = renderPage();

    fireEvent.change(getByTestId("api-token-input"), {
      target: { value: "api token" },
    });

    await waitFor(() => getByText(/Please select/i));

    fireEvent.click(getByTestId("radio-workspace-1"));

    fireEvent.click(getByTestId("notStartedLogin"));

    const login = await waitFor(() => getByTestId("startedLogin"));

    await waitFor(() => {
      expect(login).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
