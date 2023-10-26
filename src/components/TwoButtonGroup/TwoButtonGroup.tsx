import styled from "styled-components";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Stack, Button } from "@deskpro/deskpro-ui";

export interface TwoButtonGroupProps {
  selected: "one" | "two";
  oneLabel: string;
  twoLabel: string;
  oneOnClick: () => void;
  twoOnClick: () => void;
  oneIcon?: IconDefinition;
  twoIcon?: IconDefinition;
}

const Group = styled(Stack)`
  margin-bottom: 10px;
  padding: 6px 6px 7px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.grey10};
`;

const GroupButton = styled(Button)<{ selected: boolean }>`
  flex-grow: 1;
  justify-content: center;

  ${({ selected }) =>
    selected
      ? ""
      : `
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
    `}
`;

export const TwoButtonGroup = ({
  selected,
  oneLabel,
  twoLabel,
  oneOnClick,
  twoOnClick,
  oneIcon,
  twoIcon,
}: TwoButtonGroupProps) => (
  <Group
    justify="space-between"
    align="center"
    gap={6}
    style={{ width: "100%" }}
  >
    <GroupButton
      text={oneLabel}
      intent="secondary"
      icon={oneIcon}
      size="large"
      selected={selected === "one"}
      onClick={oneOnClick}
    />
    <GroupButton
      text={twoLabel}
      intent="secondary"
      icon={twoIcon}
      size="large"
      data-testid="change-time-entry-manual"
      selected={selected === "two"}
      onClick={twoOnClick}
    />
  </Group>
);
