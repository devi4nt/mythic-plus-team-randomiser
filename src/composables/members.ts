import { GuildProfile } from "@/types";
import { useFetch } from "@vueuse/core";
import { computed, Ref } from "vue";

export const useMembers = (
  region: Ref<string>,
  realm: Ref<string>,
  guild: Ref<string>
) => {
  // https://raider.io/api#/guild/getApiV1GuildsProfile
  const { isFetching, error, data } = useFetch(
    () =>
      `https://raider.io/api/v1/guilds/profile?region=${region.value}&realm=${
        realm.value
      }&name=${encodeURIComponent(guild.value)}&fields=members`,
    { refetch: true }
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
