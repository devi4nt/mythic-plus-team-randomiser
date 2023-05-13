<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import anime from "animejs";
import { useInterval } from "@vueuse/core";
import { ref, computed, watch } from "vue";
import { Member } from "@/types";

const props = defineProps<{
  members: Member[];
  filter: string;
}>();

const itemHeight = ref(24);
const itemCount = ref(5);
const interval = useInterval(2500);
const itemContainer = ref<HTMLDivElement>();
const itemContainerHeight = computed(
  () => (itemHeight.value + 4) * itemCount.value
);
const fillersTop = computed(() => {
  return props.members.slice(-2);
});
const fillersBottom = computed(() => {
  return props.members.slice(0, 2);
});

watch(interval, () => {
  const index = Math.floor(Math.random() * props.members.length);
  const element = itemContainer.value?.children[index + 2];
  const member = props.members[index];
  const scrollTop = index * (itemHeight.value + 4);
  console.log({
    index,
    element: element?.innerHTML,
    scrollTop: scrollTop,
    member: member.character.name,
  });
  // if (itemContainer.value) {
  //   itemContainer.value.scrollTop = scrollTop;
  // }
  // animate scroll top
  anime({
    targets: itemContainer.value,
    scrollTop: scrollTop,
    duration: 2000,
    easing: "easeInOutQuad",
  });
});
</script>

<template>
  <div class="flex items-center h-min">
    <ChevronRightIcon class="h-8 text-gray-400 mb-1" />
    <div
      ref="itemContainer"
      class="w-48 overflow-auto"
      :style="`height: ${itemContainerHeight}px`"
    >
      <Player
        v-for="member in fillersTop"
        :key="member.character.name"
        :character="member.character"
        class="mb-1"
      />
      <Player
        v-for="member in members"
        :key="member.character.name"
        :character="member.character"
        class="mb-1"
      />
      <Player
        v-for="member in fillersBottom"
        :key="member.character.name"
        :character="member.character"
        class="mb-1"
      />
    </div>
    <ChevronLeftIcon class="h-8 text-gray-400 mb-1" />
  </div>
</template>

<style scoped></style>
