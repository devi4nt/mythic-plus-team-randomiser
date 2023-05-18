import { GuildProfile, Region } from "@/types";
import { useFetch } from "@vueuse/core";
import { computed, Ref } from "vue";

export const useMembers = (
  region: Ref<Region>,
  realm: Ref<string>,
  guild: Ref<string>
) => {
  // https://raider.io/api#/guild/getApiV1GuildsProfile
  const { isFetching, error, data, statusCode } = useFetch(
    () =>
      `https://raider.io/api/v1/guilds/profile?region=${region.value.toLowerCase()}&realm=${
        realm.value
      }&name=${encodeURIComponent(guild.value)}&fields=members`,
    {
      refetch: true,
      async beforeFetch({ cancel }) {
        if (!region.value || !realm.value || !guild.value) {
          cancel();
        }
      },
    }
  ).json<GuildProfile>();

  const members = computed(() =>
    data.value?.members.filter((m) => m.character.active_spec_name)
  );

  return {
    data,
    members,
    isFetching,
    statusCode,
    error,
  };
};
