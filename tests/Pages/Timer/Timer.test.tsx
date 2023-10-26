import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render } from "@testing-library/react/";
import { Timer } from "../../../src/pages/Timer/Timer";
import React from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Timer />
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
    getUser: jest.fn(() => ({
      id: "1",
      name: "user",
    })),
    isRunning: jest.fn(() => ({
      tagIds: [],
    })),
    getTagsByWorkspaceId: jest.fn(() => []),
    getTag: jest.fn(() => ({
      id: 1,
    })),
    timeEntries: jest.fn(() => []),
    getProjectsByWorkspaceId: jest.fn(() => []),
    createTimeEntry: jest.fn(() => {}),
    getTimeEntriesByUserIdAndTagId: jest.fn(() => []),
  };
});

describe("Timer Page", () => {
  test("Automatic Timer should work correctly", async () => {
    act(async () => {
      const { getByTestId, getByText } = renderPage();

      await waitFor(() => getByTestId(/change-time-entry/i));

      fireEvent.click(getByTestId("change-time-entry"));

      await waitFor(() => expect(getByText(/00:00:5/i)).toBeInTheDocument());
    });
  });

  test("Error should be catched", async () => {
    act(async () => {
      jest.mock("../../../src/api/api", () => {
        return {
          getWorkspaces: jest.fn(() => [
            {
              id: "1",
              name: "workspace",
            },
          ]),
          getUser: jest.fn(() => ({
            id: "1",
            name: "user",
          })),
          isRunning: jest.fn(() => ({
            tagIds: [],
          })),
          getTagsByWorkspaceId: jest.fn(() => []),
          getTag: jest.fn(() => ({
            id: 1,
          })),
          timeEntries: jest.fn(() => []),
          getProjectsByWorkspaceId: jest.fn(() => []),
          createTimeEntry: jest.fn(() => {
            throw new Error("Error");
          }),
          getTimeEntriesByUserIdAndTagId: jest.fn(() => []),
        };
      });

      const { getByTestId, getByText } = renderPage();

      await waitFor(() => getByTestId(/change-time-entry-manual/i));

      fireEvent.click(getByTestId("change-time-entry-manual"));

      await waitFor(() => expect(getByText(/Error/i)).toBeInTheDocument());
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
