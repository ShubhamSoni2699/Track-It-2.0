import { useQuery } from "@tanstack/react-query";
import { getTag } from "../services/apiTag";

export function useTags(isCredit) {
  const {
    isPending,
    data: Tags,
    error,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTag(isCredit),
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { isPending, Tags };
}
