import React from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";
import ShortcutButtonsPlugin from "shortcut-buttons-flatpickr";
import type { Instance } from "flatpickr/dist/types/instance.d";
export { DatePickerInputWithDisplay } from "@deskpro/deskpro-ui";

type OnClickSignature = (index: number, fp: Instance) => void;
type Attributes = {
  [name: string]: string;
};
type Button = {
  attributes?: Attributes;
  label: string;
};

export type DatePickerProps = DateTimePickerProps & {
  buttons?: Button | Button[];
  onButtonClick?: OnClickSignature | OnClickSignature[] | undefined;
};

export const DatePicker = (props: DatePickerProps) => {
  return (
    <Flatpickr
      {...props}
      options={{
        minuteIncrement: 1,
        ...props.options,
        plugins: props.buttons
          ? [
              ShortcutButtonsPlugin({
                button: props.buttons,
                onClick: props.onButtonClick,
              }),
            ]
          : [],
        clickOpens: !props.disabled,
      }}
    />
  );
};

export const DateTimePicker = (props: DatePickerProps) => {
  return (
    <Flatpickr
      {...props}
      options={{
        minuteIncrement: 1,
        enableTime: true,
        time_24hr: true,
        ...props.options,
        plugins: props.buttons
          ? [
              ShortcutButtonsPlugin({
                button: props.buttons,
                onClick: props.onButtonClick,
              }),
            ]
          : [],
        clickOpens: !props.disabled,
      }}
    />
  );
};
