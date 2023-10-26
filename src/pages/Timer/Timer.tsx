import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
  Select,
} from "@deskpro/app-sdk";
import {
  AnyIcon,
  Button,
  Checkbox,
  H1,
  H2,
  P8,
  Stack,
  Tag,
  Label,
} from "@deskpro/deskpro-ui";
import {
  faPlus,
  faTimes,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createTimeEntry,
  getProjectsByWorkspaceId,
  getTag,
  getTagsByWorkspaceId,
  getTimeEntriesByUserIdAndTagId,
  getUser,
  getWorkspaces,
  isRunning,
  stopTimeEntry,
} from "../../api/api";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { Property } from "../../styles";
import { colors, dateToHHMMSS } from "../../utils/utils";
import { TwoButtonGroup } from "../../components/TwoButtonGroup/TwoButtonGroup";
import { DateField } from "../../components/DateField/DateField";
import { queryClient } from "../../query";

export const Timer = () => {
  const navigate = useNavigate();
  const { theme } = useDeskproAppTheme();

  const [isProjReq, setIsProjReq] = useState<boolean | null>(null);
  const [page, setPage] = useState<number>(0);
  const [initiallyChecked, setInitiallyChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>("");
  const [isBillable, setIsBillable] = useState<boolean>(false);
  const [project, setProject] = useState<string | undefined>(undefined);
  const [timePassedMs, setTimePassedMs] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const [refreshedTimePassed, setRefreshedTimePassed] =
    useState<boolean>(false);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle(`Create Time Entry`);

    client.registerElement("refresh", {
      type: "refresh_button",
    });

    client.registerElement("menuButton", {
      type: "menu",
      items: [
        {
          title: "Logout",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          queryClient.clear();

          client?.setUserState("workspace", "");

          navigate("/login");
      }
    },
  });

  const workspacesQuery = useQueryWithClient(
    ["workspaces"],
    (client) => getWorkspaces(client),
    {
      enabled: !!client,
    }
  );

  const userQuery = useQueryWithClient(["user"], (client) => getUser(client));

  const isInitiallyRunningQuery = useQueryWithClient(
    ["isRunning"],
    (client) => isRunning(client, userQuery.data?.id as string),
    {
      enabled: !!userQuery.data?.id,
    }
  );

  const tagQuery = useQueryWithClient(
    ["tag"],
    (client) => getTag(client, `deskpro-ticket-${context?.data.ticket.id}`),
    {
      enabled: !!context?.data.ticket.id,
    }
  );

  const tagsQuery = useQueryWithClient(
    ["tags"],
    (client) => getTagsByWorkspaceId(client),
    {
      enabled: !!context?.data.ticket.id,
    }
  );

  const timeEntriesQuery = useQueryWithClient(
    ["getTimeEntriesByUserIdAndTagId", userQuery.data, tagQuery.data],
    (client) =>
      getTimeEntriesByUserIdAndTagId(
        client,
        userQuery.data?.id as string,
        tagQuery.data.id
      ),
    {
      enabled: !!userQuery.isSuccess && !!tagQuery.isSuccess,
    }
  );

  const projectsQuery = useQueryWithClient(["projects"], (client) =>
    getProjectsByWorkspaceId(client)
  );

  const toggled = timeEntriesQuery.data?.find(
    (e) => e.timeInterval.end === null
  );

  useEffect(() => {
    (async () => {
      const currentWorkspaceId = await client?.getUserState("workspace");

      const workspace = workspacesQuery.data?.find(
        (e) => e.id === currentWorkspaceId?.[0].data
      );

      if (!workspace) return;

      setIsProjReq(workspace.workspaceSettings.forceProjects);
    })();
  });

  useEffect(() => {
    if (initiallyChecked || !timeEntriesQuery.isSuccess || !toggled) return;

    setProject(toggled.projectId);
    setSubject(toggled.description);
    setIsBillable(toggled.billable);
    setTags(toggled.tagIds);
  }, [initiallyChecked, timeEntriesQuery.isSuccess, toggled]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timeEntriesQuery.data) return;

      const timePassedEntries = timeEntriesQuery.data.reduce((acc, curr) => {
        if (curr.timeInterval.end === null) return acc;

        return (
          acc +
          (new Date(curr.timeInterval.end).getTime() -
            new Date(curr.timeInterval.start).getTime())
        );
      }, 0);

      const timePassedNow = toggled
        ? new Date().getTime() -
          new Date(
            timeEntriesQuery.data.find((e) => e.timeInterval.end === null)
              ?.timeInterval.start ?? 0
          ).getTime()
        : 0;

      setRefreshedTimePassed(true);

      setTimePassedMs(timePassedEntries + timePassedNow);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeEntriesQuery.data, toggled, refreshedTimePassed]);

  const usedColorsTags = useMemo(() => {
    return new Array(tags.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  if (
    !client ||
    !timeEntriesQuery.isSuccess ||
    timePassedMs === null ||
    !userQuery.isSuccess ||
    !projectsQuery.isSuccess ||
    !workspacesQuery.isSuccess ||
    isProjReq === null
  )
    return <LoadingSpinnerCenter />;

  if (
    !initiallyChecked &&
    isInitiallyRunningQuery.data &&
    !isInitiallyRunningQuery.data?.tagIds.includes(tagQuery.data.id)
  ) {
    return (
      <Stack vertical gap={10}>
        <H1>
          There is currently a time entry already running that does not belong
          to this ticket.
          <br />
          In order to continue, the time entry must be stopped.
        </H1>
        <Button
          text="⠀⠀Stop⠀⠀"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await stopTimeEntry(
              client,
              userQuery.data.id,
              new Date().toISOString()
            ).then(() => {
              isInitiallyRunningQuery.refetch();
              setInitiallyChecked(true);
            });
            setLoading(false);
          }}
        ></Button>
      </Stack>
    );
  }

  return (
    <Stack vertical gap={10}>
      <Stack style={{ alignSelf: "center", width: "100%" }}>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Timer"
          twoLabel="Manual"
          oneOnClick={() => !toggled && setPage(0)}
          twoOnClick={() => !toggled && setPage(1)}
        />
      </Stack>
      <InputWithTitle
        title="Description"
        setValue={setSubject}
        disabled={!!toggled}
        value={subject}
      />
      {projectsQuery.data.length > 0 && (
        <Label label="Project">
          <Select<string>
            onChange={(e) => setProject(e[0])}
            options={projectsQuery.data?.map((e) => ({
              key: e.id,
              label: e.name,
              value: e.id,
              type: "value",
            }))}
            error={!toggled && !project}
            disabled={!!toggled}
            initValue={[]}
          />
        </Label>
      )}
      <Stack vertical style={{ width: "100%" }}>
        <Stack vertical style={{ color: theme.colors.grey80 }} gap={5}>
          <P8 style={{ color: theme?.colors?.grey80 }}>Tags</P8>
          <Stack gap={5} style={{ flexWrap: "wrap" }}>
            {tags.map((tag, i) => (
              <Tag
                closeIcon={faTimes as AnyIcon}
                color={usedColorsTags[i]}
                onCloseClick={() =>
                  !toggled
                    ? setTags((prev) => prev.filter((e) => e !== tag))
                    : {}
                }
                label={tagsQuery.data?.find((e) => e.id === tag)?.name ?? tag}
                key={i}
                withClose
              ></Tag>
            ))}
          </Stack>
        </Stack>
        <Stack gap={5} style={{ width: "100%", alignItems: "center" }}>
          <Select<string>
            options={
              tagsQuery.data
                ?.filter((e) => !e.name.startsWith("deskpro-ticket-"))
                .map((e) => ({
                  key: e.id,
                  label: e.name,
                  value: e.id,
                  type: "value",
                })) ?? []
            }
            initValue={[]}
            onChange={(value) => {
              !toggled && setTags(value as string[]);
            }}
          >
            <Button
              text="Add"
              icon={faPlus as AnyIcon}
              minimal
              style={{
                borderBottom: `1px solid ${theme.colors.grey20}`,
              }}
            />
          </Select>
        </Stack>
      </Stack>
      <Stack vertical gap={5}>
        <P8 style={{ color: theme?.colors?.grey80 }}>Billable</P8>
        <Checkbox
          disabled={!!toggled}
          label="Billable"
          checked={isBillable}
          onChange={() => setIsBillable(!isBillable)}
        />
      </Stack>
      {page === 0 && (
        <div style={{ fontWeight: "bold" }}>
          <Property
            label="Time Elapsed"
            text={<H2>{dateToHHMMSS(timePassedMs).toString()}</H2>}
          />
        </div>
      )}
      {page === 1 && (
        <>
          <DateField
            value={startDate || ""}
            required
            onChange={(e: Date[]) => setStartDate(e[0].toISOString())}
            label="Start Date"
          />
          <DateField
            value={endDate || ""}
            required
            onChange={(e: Date[]) => setEndDate(e[0].toISOString())}
            label="End Date"
          />
        </>
      )}
      <Button
        loading={loading}
        data-testid="change-time-entry"
        text={page === 1 ? "⠀⠀Create⠀⠀" : toggled ? "⠀⠀Stop⠀⠀" : "⠀⠀Start⠀⠀"}
        onClick={async () => {
          if (toggled) {
            setLoading(true);

            await stopTimeEntry(
              client,
              userQuery.data.id,
              new Date().toISOString()
            ).then(() => {
              timeEntriesQuery.refetch();
            });

            setLoading(false);

            return;
          }

          if (
            (page === 1 && (!startDate || !endDate)) ||
            (!project && isProjReq)
          )
            return;

          setLoading(true);

          await createTimeEntry(client, {
            start: new Date().toISOString(),
            description: subject,
            tagIds: [
              tagQuery.data.id,
              ...tags.filter((e) => e !== tagQuery.data.id),
            ],
            ...(project && { projectId: project }),
            billable: isBillable,
            ...(page === 1 ? { start: startDate, end: endDate } : {}),
          }).then(() => {
            timeEntriesQuery.refetch();
            setTimePassedMs(timePassedMs + 1000);
          });

          setRefreshedTimePassed(false);

          setLoading(false);
        }}
      />
    </Stack>
  );
};
