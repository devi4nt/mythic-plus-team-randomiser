<script setup lang="ts">
import { Member } from "@/types";
import Player from "./Player.vue";
import { computed, ref, watch } from "vue";
import { useIntervalFn } from "@vueuse/core";
import ConfettiExplosion from "vue-confetti-explosion";

const props = defineProps<{
  number: number;
  team: Member[];
}>();

const showConfetti = ref(false);
const team = computed(() => props.team);
const amount = ref(0);

const colors = computed(() =>
  team.value.map((member) => {
    if (member.pug) {
      return "#e5a023";
    } else if (member.character.class === "Demon Hunter") {
      return "#a330c9";
    } else if (member.character.class === "Death Knight") {
      return "#c41f3b";
    } else if (member.character.class === "Druid") {
      return "#ff7d0a";
    } else if (member.character.class === "Hunter") {
      return "#abd473";
    } else if (member.character.class === "Mage") {
      return "#69ccf0";
    } else if (member.character.class === "Monk") {
      return "#00ff96";
    } else if (member.character.class === "Paladin") {
      return "#f58cba";
    } else if (member.character.class === "Priest") {
      return "#ffffff";
    } else if (member.character.class === "Rogue") {
      return "#fff569";
    } else if (member.character.class === "Shaman") {
      return "#0070de";
    } else if (member.character.class === "Warlock") {
      return "#9482c9";
    } else if (member.character.class === "Warrior") {
      return "#c79c6e";
    } else if (member.character.class === "Evoker") {
      return "#33937f";
    }
    return "#454545";
  })
);

watch(
  team,
  () => {
    amount.value = 1;
    showConfetti.value = false;
    const { pause } = useIntervalFn(async () => {
      amount.value++;
      if (amount.value > 4) {
        showConfetti.value = true;
        pause();
      }
    }, 500);
  },
  { immediate: true }
);
</script>

<template>
  <div class="fixed inset-0 z-10">
    <ConfettiExplosion
      v-if="showConfetti"
      class="absolute left-1/2 -translate-x-1/2"
      :particle-size="16"
      :colors="colors"
    />
    <div class="fixed inset-0 bg-[#454545] bg-opacity-75 transition-opacity" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        class="flex flex-col bg-[#494949] w-[400px] h-[340px] gap-2 rounded-md drop-shadow-md"
      >
        <div class="font-bold text-4xl text-gray-400 pl-4 pt-4">
          Team {{ number }}
        </div>
        <div>
          <template v-for="(member, index) in team" :key="index">
            <Player
              v-if="amount > index"
              class="scaler ml-36 my-6"
              :character="member.character"
              :pug="member.pug"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scaler {
  transform: scale(2);
}
</style>
