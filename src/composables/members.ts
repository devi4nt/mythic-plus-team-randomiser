import { GuildProfile } from "@/types";
import { useFetch } from "@vueuse/core";
import { computed } from "vue";

export const useMembers = () => {
  // https://raider.io/api#/guild/getApiV1GuildsProfile
  const { isFetching, error, data } = useFetch(
    `https://raider.io/api/v1/guilds/profile?region=eu&realm=connected-quel-thalas&name=Blank%20Slate&fields=members`
  ).json<GuildProfile>();

  const members = computed(() =>
    data.value?.members.filter((m) => m.character.active_spec_name)
  );

  return {
    data,
    members,
    isFetching,
    error,
  };
};
