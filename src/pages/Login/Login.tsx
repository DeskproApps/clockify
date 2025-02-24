import {
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { Button, H1, H5, Radio, Stack } from "@deskpro/deskpro-ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { getWorkspaces } from "../../api/api";
import { parseJsonErrorMessage } from "../../utils/utils";
import { StyledLink } from "../../styles";

export const Login = () => {
  const navigate = useNavigate();
  const { theme } = useDeskproAppTheme();
  const [workspace, setWorkspace] = useState<string | undefined>(undefined);
  const [apiToken, setApiToken] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [startLogin, setStartLogin] = useState<boolean>(false);

  const workspaces = useQueryWithClient(
    ["workspaces", submitted as unknown as string, apiToken as string],
    (client) => getWorkspaces(client),
    { enabled: !!submitted, useErrorBoundary: false }
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Clockify Login Page");
    client.deregisterElement("menuButton");
  }, []);

  useInitialisedDeskproAppClient(
    (client) =>
      (async () => {
        if (!apiToken) return;

        await client.setUserState("api_token", apiToken, {
          backend: true,
        });

        setSubmitted(true);
      })(),
    [apiToken]
  );

  useInitialisedDeskproAppClient(
    (client) => {
      if (!workspace || !startLogin) return;

      client.setUserState("workspace", workspace);

      navigate("/timer");
    },
    [startLogin, workspace]
  );

  return (
    <Stack vertical gap={10} style={{ padding: "8px", boxSizing: 'border-box'}}>
      <InputWithTitle
        setValue={(e) => setApiToken(e)}
        title="API Token"
        value={apiToken}
        data-testid="api-token-input"
        error={!!workspaces.error}
      />
      {!submitted && (
        <div>
          <H5>You can find the API Token in the</H5>
          <StyledLink
            to='https://app.clockify.me/user/preferences#advanced'
            target="_blank"
          >
            'Advanced' tab of the 'Preferences' from the user menu.
          </StyledLink>
        </div>
      )}
      {(workspaces.error as string) && !workspaces.isFetching && (
        <H1 style={{ color: theme.colors.red100 }}>
          {
            parseJsonErrorMessage(
              (workspaces.error as Error).toString()
            ) as string
          }
        </H1>
      )}
      {!submitted}
      {workspaces.isFetching ? (
        <LoadingSpinnerCenter />
      ) : (
        workspaces.isSuccess && (
          <Stack vertical gap={5}>
            <H1>Please select the workspace you'd like to use:</H1>
            <Stack vertical style={{ marginTop: "10px" }} gap={10}>
              <Stack vertical gap={10}>
                {workspaces.data?.map((workspaceFromList, i) => (
                  <Stack gap={5} key={i}>
                    <Radio
                      style={{
                        color: theme.colors.grey500,
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      data-testid={`radio-workspace-${workspaceFromList.id}`}
                      checked={workspace === workspaceFromList.id}
                      onChange={() => setWorkspace(workspaceFromList.id)}
                    />
                    <H1>{workspaceFromList.name}</H1>
                  </Stack>
                ))}
                <Button
                  text="Login"
                  data-testid={startLogin ? "startedLogin" : "notStartedLogin"}
                  onClick={() => {
                    if (!workspace) return;

                    setStartLogin(true);
                  }}
                ></Button>
              </Stack>
              {!!workspaces.error && (
                <H1>
                  There was an error fetching your workspaces. Please make sure
                  the API Token is correct
                </H1>
              )}
            </Stack>
          </Stack>
        )
      )}
    </Stack>
  );
};
