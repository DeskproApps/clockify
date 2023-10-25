/* eslint-disable @typescript-eslint/no-explicit-any */
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import "intersection-observer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { lightTheme } from "@deskpro/deskpro-ui";
import { mockClient } from "./testing";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;

const context = {
  type: "ticket",
  settings: {},
  data: {
    ticket: {
      id: "215",
      subject: "Big ticket",
      permalinkUrl: "https://permalink.url",
    },
    app: {},
    env: {},
    currentAgent: {},
  },
};

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppClient: () => ({ client: mockClient }),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(context);
      !!hooks.onShow && hooks.onShow(context);
      !!hooks.onReady && hooks.onReady(context);
      !!hooks.onAdminSettingsChange &&
        hooks.onAdminSettingsChange(context.settings);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useInitialisedDeskproAppClient: (
    callback: (param: typeof mockClient) => void
  ) => {
    callback(mockClient);
  },
  useDeskproLatestAppContext: () => ({ context }),
  useDeskproAppTheme: () => ({ theme: lightTheme }),
  proxyFetch: async () => fetch,
  LoadingSpinner: () => <>Loading...</>,
  useQueryWithClient: (queryKey: string, queryFn: () => any, options: any) => {
    queryKey;
    options;
    if (!options || options?.enabled == null || options?.enabled == true) {
      return {
        isSuccess: true,
        data: queryFn(),
        isLoading: false,
        refetch: () => {},
      };
    }
    return {
      isSuccess: false,
      data: null,
      isLoading: false,
    };
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
