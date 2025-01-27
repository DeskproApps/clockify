import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, Input, P8, Stack } from "@deskpro/deskpro-ui";
import { ChangeEvent } from "react";

type Props = {
  title: string;
  error?: boolean;
  required?: boolean;
  value?: string;
  setValue: (key: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputWithTitle = ({
  title,
  error,
  required,
  value,
  setValue,
  ...attributes
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical style={{ width: "100%", marginTop: "5px" }}>
      <Stack>
        <div style={{ color: theme?.colors?.grey80 }}>
          <P8>{title}</P8>
        </div>
        {required && (
          <Stack style={{ color: theme?.colors?.red100 }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      <Input
        error={error}
        variant="inline"
        placeholder={`Enter value`}
        style={{ fontWeight: "normal" }}
        type={"title"}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        value={value}
        {...attributes}
      />
    </Stack>
  );
};
