<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid';
import Modal from './Modal.vue';
import RaiderIO from './RaiderIO.vue';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Modal :show="show" @close="emit('close')">
    <div class="bg-[#494949] rounded-lg p-4">
      <div class="flex justify-between">
        <div class="text-left text-2xl text-gray-400 font-bold">Mythic+ Team Randomiser</div>
        <XMarkIcon
          @click="emit('close')"
          class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
        />
      </div>
      <div class="flex flex-col gap-4 mt-4 text-left text-gray-400 text-sm">
        <div>
          This started life as a tool I made for my guild. I figured it could be useful to the wider
          community. If you find any bugs please
          <a
            href="https://github.com/devi4nt/mythic-plus-team-randomiser/issues"
            class="text-raiderio underline"
            target="_blank"
            rel="noreferrer"
            >raise an issue</a
          >. If you have any ideas or suggestions feel free to
          <a
            href="https://github.com/devi4nt/mythic-plus-team-randomiser/discussions"
            class="text-raiderio underline"
            target="_blank"
            rel="noreferrer"
            >start a discussion</a
          >.
        </div>
        <div>
          If you like this tool, please consider
          <a
            href="https://buymeacoffee.com/devi4nt"
            target="_blank"
            rel="noreferrer"
            class="text-raiderio underline"
            >buying me a coffee</a
          >. It's a great way to support my work and motivate me to keep creating new tools.
        </div>

        <a href="https://buymeacoffee.com/devi4nt" target="_blank">
          <div class="inline-flex bg-raiderio hover:brightness-90 rounded-md p-2 cursor-pointer">
            <img class="h-6" src="../assets/images/buy-me-a-coffee.png" />
          </div>
        </a>
        <div>
          <div>
            A special thanks to the amazing people at
            <a
              href="https://raider.io"
              target="_blank"
              rel="noreferrer"
              class="text-raiderio underline"
              >raider.io</a
            >
            without their public API this tool wouldn't be possible!
          </div>
          <div class="flex justify-end">
            <a
              href="https://raider.io"
              target="_blank"
              rel="noreferrer"
              class="text-raiderio underline"
              ><RaiderIO class="w-24"
            /></a>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
