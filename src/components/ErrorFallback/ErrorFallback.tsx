import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import { parseJsonErrorMessage } from "../../utils/utils";
import { Button, H1, H2, Stack } from "@deskpro/deskpro-ui";
import { FallbackRender } from "@sentry/react";

export const ErrorFallback: FallbackRender = ({
  error,
  resetError,
}) => {
  return (
    <Stack vertical gap={10} role="alert">
      <H1>Something went wrong:</H1>
      <H2 style={{ maxWidth: "100%" }}>
        {parseJsonErrorMessage((error as any).message)}
      </H2>
      <Button
        text="Reload"
        onClick={resetError}
        icon={faRefresh}
        intent="secondary"
      />
    </Stack>
  );
};
