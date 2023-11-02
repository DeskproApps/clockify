/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, Input, Stack, Label as UILabel } from "@deskpro/deskpro-ui";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { DateTimePickerProps } from "react-flatpickr";
import styled from "styled-components";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import "./DateField.css";

const LabelDate = styled(UILabel)`
  margin-top: 5px;
`;

export type MappedFieldProps = DateTimePickerProps & {
  id?: string;
  label: string;
  error?: boolean;
  value: string;
  onChange: (date: [Date]) => void;
};

const DateInput = styled(Input)`
  :read-only {
    cursor: pointer;
  }
`;

export const DateField: FC<MappedFieldProps> = ({
  id,
  value,
  label,
  error,
  onChange,
  required,
  ...props
}: MappedFieldProps) => {
  const { theme } = useDeskproAppTheme();

  return (
    <DateTimePicker
      value={new Date(value)}
      onChange={onChange}
      {...props}
      render={(_: any, ref: any) => (
        <LabelDate htmlFor={id}>
          <Stack align="center" style={{ color: theme?.colors.grey80 }}>
            <H1>{label}</H1>
            {required && (
              <Stack style={{ color: "red" }}>
                <H1>⠀*</H1>
              </Stack>
            )}
          </Stack>
          <div
            style={
              error
                ? {
                    borderBottom: `1px solid ${theme.colors.red40}`,
                  }
                : {}
            }
          >
            <DateInput
              id={id}
              ref={ref}
              error={error}
              variant="inline"
              inputsize="small"
              placeholder="DD/MM/YYYY"
              style={{ backgroundColor: "transparent" }}
              rightIcon={{
                icon: faCalendarDays,
                // doesnt like style, but it does accept it
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                style: {
                  color: theme?.colors.grey40,
                },
              }}
            />
          </div>
        </LabelDate>
      )}
    />
  );
};
