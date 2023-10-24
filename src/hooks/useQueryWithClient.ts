/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useQueryMutationWithClient = <
  TFuncParams = unknown,
  TData = unknown
>(
  queryFn: (client: IDeskproClient, data: TFuncParams) => Promise<TData>,
  options?:
    | Omit<UseMutationOptions<TData, unknown, unknown, unknown>, "mutationFn">
    | undefined
) => {
  const { client } = useDeskproAppClient();

  return useMutation<TData, unknown, unknown, unknown>(
    (data) =>
      (!client ? null : queryFn(client, data as TFuncParams)) as ReturnType<
        typeof queryFn
      >,
    options
  );
};
