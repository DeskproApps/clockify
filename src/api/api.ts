import { IDeskproClient, ProxyResponse, proxyFetch } from "@deskpro/app-sdk";
import { ICreateTimeEntry, ITimeEntry } from "../types/timeEntry";
import { RequestMethod } from "./types";
import { IWorkspace } from "../types/workspace";

export const isRunning = async (client: IDeskproClient, userId: string) => {
  const result = await getTimeEntriesByUserId(client, userId);

  return result.find((entry) => !entry.timeInterval.end) ?? null;
};

export const getTag = async (client: IDeskproClient, name: string) => {
  const tags = await getTagsByWorkspaceId(client);
  const tag = tags?.find((t) => t.name === name);

  if (tag) {
    return tag;
  }

  return createTag(client, name);
};

export const getTagById = async (client: IDeskproClient, id: string) =>
  installedRequest(client, `workspaces/[user[workspace]]/tags/${id}`, "GET");

export const createTag = async (client: IDeskproClient, name: string) =>
  installedRequest(client, "workspaces/[user[workspace]]/tags", "POST", {
    name,
  });

export const getUser = (client: IDeskproClient): Promise<{ id: string }> =>
  installedRequest(client, "user", "GET");

export const stopTimeEntry = (
  client: IDeskproClient,
  userId: string,
  end: string | null
): Promise<ITimeEntry> =>
  installedRequest(
    client,
    `workspaces/[user[workspace]]/user/${userId}/time-entries`,
    "PATCH",
    {
      end,
    }
  );

export const getTimeEntriesByUserIdAndTagId = (
  client: IDeskproClient,
  userId: string,
  tagId: string
): Promise<ITimeEntry[]> =>
  installedRequest(
    client,
    `workspaces/[user[workspace]]/user/${userId}/time-entries?tags=${tagId}`,
    "GET"
  );

export const getTimeEntriesByUserId = (
  client: IDeskproClient,
  userId: string
): Promise<ITimeEntry[]> =>
  installedRequest(
    client,
    `workspaces/[user[workspace]]/user/${userId}/time-entries`,
    "GET"
  );

export const getTimeEntry = (
  client: IDeskproClient,
  id: string
): Promise<ITimeEntry> =>
  installedRequest(
    client,
    `workspaces/[user[workspace]]/time-entries/${id}`,
    "GET"
  );

export const createTimeEntry = (
  client: IDeskproClient,
  data: ICreateTimeEntry
) =>
  installedRequest(
    client,
    "workspaces/[user[workspace]]/time-entries",
    "POST",
    data
  );

export const getTagsByWorkspaceId = (
  client: IDeskproClient
): Promise<{ id: string; name: string }[]> =>
  installedRequest(client, "workspaces/[user[workspace]]/tags", "GET");

export const getProjectsByWorkspaceId = (
  client: IDeskproClient
): Promise<{ name: string; id: string }[]> =>
  installedRequest(client, "workspaces/[user[workspace]]/projects", "GET");

export const getTaskByWorkspaceProjectId = (
  client: IDeskproClient,
  projectId: string
) =>
  installedRequest(
    client,
    `workspaces/[user[workspace]]/projects/${projectId}/tasks`,
    "GET"
  );

export const getWorkspaces = (client: IDeskproClient): Promise<IWorkspace[]> =>
  installedRequest(client, "workspaces", "GET");

const installedRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": "[user[api_token]]",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(
    `https://api.clockify.me/api/v1/${endpoint}`,
    options
  );

  if (
    isResponseError(response) ||
    (response.status === 400 && endpoint === "tags")
  ) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(`${json.error} ${json.errorDescription}`);
  }

  return json;
};

export const isResponseError = (response: ProxyResponse) =>
  response.status < 200 || response.status >= 400;
