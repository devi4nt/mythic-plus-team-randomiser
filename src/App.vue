<script setup lang="ts">
import "./assets/css/main.css";

import {
  XMarkIcon,
  ArrowPathRoundedSquareIcon,
  StarIcon,
  PlusIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/20/solid";
import Btn from "./components/Btn.vue";
import Player from "./components/Player.vue";
import PlayerTeam from "./components/PlayerTeam.vue";
import RoleFilter from "./components/RoleFilter.vue";
// import RankFilter from "./components/RankFilter.vue";
import RaiderIO from "./components/RaiderIO.vue";
import Alert from "./components/Alert.vue";
import { Ref, computed, ref, watch } from "vue";
import { ClassFilter, ClassRole, IAlert, Member, Region, Team } from "./types";
import { v4 as uuidv4 } from "uuid";
import { classSpecs, classSpecRole } from "./data/specs";
import { useMembers } from "./composables/members";
import { shuffle } from "./utils/array";
import { pause } from "./utils/time";
import { useSessionStorage, useLocalStorage, useTimeoutFn } from "@vueuse/core";
import ModalSettings from "./components/ModalSettings.vue";
import ModalInfo from "./components/ModalInfo.vue";
import Loader from "./components/Loader.vue";
import TeamReveal from "./components/TeamReveal.vue";

const filter = ref("");
// const rank = ref(6);
const role = ref<ClassFilter>("ALL");
const minPlayers = ref(6);
const teams = useSessionStorage<Team[]>("teams", []);
const pickedMembers = ref<Member[]>([]);
const selectedMembers = useSessionStorage<Member[]>("selected", []);
const pugs = useSessionStorage<Member[]>("pugs", []);
const fatal = ref<string | null>(null);
const error = ref<string | null>(null);
const warning = ref<string | null>(null);
const success = ref<string | null>(null);
const showTeams = ref(true);

const region = useLocalStorage<Region>("region", "EU");
const realm = useLocalStorage<string>("realm", "");
const guild = useLocalStorage<string>("guild", "");
const fancy = useLocalStorage<boolean>("fancy", true);
const autoPug = useLocalStorage<boolean>("autoPug", false);

const showInfo = ref(false);
const showSettings = ref(false);

const { members, isFetching, statusCode } = useMembers(region, realm, guild);

watch(
  statusCode,
  (code) => {
    if (code === 400) {
      fatal.value =
        "Could not find requested guild, please double check the guild name, realm and try again.";
    } else if (/^2/.test(String(code))) {
      fatal.value = null;
    }
  },
  { immediate: true }
);

const tanks = computed(() =>
  selectedMembers.value.filter((member) => {
    return member.character.active_spec_role === "TANK";
  })
);

const damageDealers = computed(() =>
  selectedMembers.value.filter((member) => {
    return member.character.active_spec_role === "DPS";
  })
);

const healers = computed(() =>
  selectedMembers.value.filter((member) => {
    return member.character.active_spec_role === "HEALING";
  })
);

const filteredMembers = computed<Member[]>(() => {
  return members.value
    ? members.value
        .filter((member) => {
          // apply text filter
          const textFilter =
            filter.value === "" ||
            [
              member.character.name,
              member.character.class,
              member.character.active_spec_name,
            ]
              .join(" ")
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          // next.. apply rank filter
          // const rankFilter = member.rank <= rank.value || member.rank === 99;
          // next.. apply role filter
          const roleFilter =
            role.value === "ALL" ||
            member.character.active_spec_role === role.value;
          // next.. hide deleted characters
          const deletedFilter = member.character.name.search(/-\d+$/) === -1;
          // then.. exclude already selected members
          return (
            textFilter &&
            // rankFilter &&
            roleFilter &&
            deletedFilter &&
            !selectedMembers.value.includes(member)
          );
        })
        .sort((a, b) => {
          return a.character.name.localeCompare(b.character.name);
        })
    : [];
});

const rolesText = computed(() => {
  let text = "";
  if (tanks.value.length) {
    text += `${tanks.value.length} tank${tanks.value.length > 1 ? "s" : ""}`;
    if (damageDealers.value.length || healers.value.length) {
      text += ", ";
    }
  }
  if (damageDealers.value.length) {
    text += `${damageDealers.value.length} dps`;
    if (healers.value.length) {
      text += ", ";
    }
  }
  if (healers.value.length) {
    text += `${healers.value.length} healer${
      healers.value.length > 1 ? "s" : ""
    }`;
  }
  return text;
});

// onMounted(() => {
//   selectedMembers.value = [...filteredMembers.value];
// });

// randomly select a team member
function randomMember(
  members: Ref<Member[]>,
  filter?: (member: Member) => boolean
) {
  const unpickedMembers = members.value.filter(
    (member) =>
      // exclude already picked members (by name)
      !pickedMembers.value.find(
        (pm) => pm.character.name === member.character.name
      ) &&
      // optional additional filter
      (!filter || filter(member))
  );
  shuffle(unpickedMembers);
  return unpickedMembers[Math.floor(Math.random() * unpickedMembers.length)];
}

function selectCaptain() {
  return randomMember(
    ref([...tanks.value, ...damageDealers.value, ...healers.value]),
    (member: Member) => !!member.captain
  );
}

function selectTank() {
  return randomMember(tanks);
}

function selectDamageDealer() {
  return randomMember(damageDealers);
}

function selectHealer() {
  return randomMember(healers);
}

function remove(removeMember: Member) {
  selectedMembers.value = selectedMembers.value.filter((member) => {
    return member !== removeMember;
  });

  pugs.value = pugs.value.filter((member) => {
    return member !== removeMember;
  });
}

function toggleCaptain(member: Member) {
  member.captain = !member.captain;
}

function toggleSpec(member: Member) {
  const specs = classSpecs[member.character.class];
  const currentIndex = specs.indexOf(member.character.active_spec_name);
  member.character.active_spec_name =
    specs[(currentIndex + 1) % classSpecs[member.character.class].length];
  member.character.active_spec_role =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    classSpecRole[member.character.class][member.character.active_spec_name]!;
}

function addPug(role: ClassRole = "DPS") {
  const member: Member = {
    rank: 7,
    character: {
      name: uuidv4(),
      class: "Monk",
      active_spec_name: "Windwalker",
      active_spec_role: role,
    },
    pug: true,
  };
  selectedMembers.value.push(member);
  pugs.value.push(member);
}

function reset() {
  // reset teams
  teams.value.length = 0;
  pickedMembers.value.length = 0;
  error.value = null;
  // reset selected members
  selectedMembers.value.length = 0;
}

async function randomise() {
  // reset teams
  teams.value.length = 0;
  pickedMembers.value.length = 0;
  error.value = null;

  // auto pug logic
  if (autoPug.value) {
    // remove existing pugs
    const currentPugs = selectedMembers.value.filter((member) => member.pug);
    currentPugs.forEach((member) => remove(member));

    const amount = Math.ceil(selectedMembers.value.length / 5);

    // add tank pugs
    let current = tanks.value.length;
    for (let index = 0; index < amount - current; index++) {
      addPug("TANK");
    }

    // add dps pugs
    current = damageDealers.value.length;
    for (let index = 0; index < amount * 3 - current; index++) {
      addPug("DPS");
    }

    // add healers
    current = healers.value.length;
    for (let index = 0; index < amount - current; index++) {
      addPug("HEALING");
    }
  }

  const amount = Math.ceil(selectedMembers.value.length / 5);

  // select captains
  const captains = [];
  for (let index = 0; index < amount; index++) {
    const captain = selectCaptain();
    if (captain) {
      pickedMembers.value.push(captain);
      captains.push(captain);
    }
  }
  // console.log(`picking ${amount} teams`);
  for (let index = 0; index < amount; index++) {
    // console.log(`picking team: ${index + 1}`);
    // randomly select a tank
    const captain = captains[index];
    const tank =
      captain && captain.character.active_spec_role === "TANK"
        ? captain
        : selectTank();
    if (!tank) {
      if (!teams.value.length) {
        error.value = "Not enough tanks";
      }
      break;
    }
    pickedMembers.value.push(tank);
    // randomly select damage dealers
    const dps1 =
      captain && captain.character.active_spec_role === "DPS"
        ? captain
        : selectDamageDealer();
    if (dps1) {
      pickedMembers.value.push(dps1);
    }
    const dps2 = selectDamageDealer();
    if (dps2) {
      pickedMembers.value.push(dps2);
    }
    const dps3 = selectDamageDealer();
    if (dps3) {
      pickedMembers.value.push(dps3);
    }
    if (!dps1 || !dps2 || !dps3) {
      if (!teams.value.length) {
        error.value = "Not enough dps";
      }
      break;
    }
    // randomly select a healer
    const healer =
      captain && captain.character.active_spec_role === "HEALING"
        ? captain
        : selectHealer();
    if (!healer) {
      if (!teams.value.length) {
        error.value = "Not enough healers";
      }
      break;
    }
    if (healer) {
      pickedMembers.value.push(healer);
    }
    const members = [tank, dps1, dps2, dps3, healer];
    if (fancy.value) {
      revealTeam.value = members;
      await pause(4000);
      revealTeam.value = undefined;
    }
    teams.value.push({
      id: uuidv4(),
      members,
    });
    // console.log(
    //   `team members: ${members
    //     .map((member) => member.character.name)
    //     .join(", ")}`
    // );
  }

  const roundedAmount = Math.floor(amount);
  const playersLeft = selectedMembers.value.length - teams.value.length * 5;
  if (amount !== roundedAmount || teams.value.length !== roundedAmount) {
    warning.value = `Too few eligible players to assign all roles ${teams.value.length} teams created, ${playersLeft} players left`;
  } else if (!error.value) {
    success.value = "Teams successfully randomised";
  }
}

const dragging = ref<boolean>(false);
const revealTeam = ref<Member[] | undefined>();

function startDrag(event: DragEvent, member: Member) {
  if (event.dataTransfer) {
    // console.log(member);
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("characterName", member.character.name);
    dragging.value = true;
  }
}

function onDrop(event: DragEvent) {
  const characterName = event.dataTransfer?.getData("characterName");
  // console.log("onDrop", event, characterName);
  const member = filteredMembers.value.find(
    (member) => member.character.name === characterName
  );
  if (member) {
    selectedMembers.value.push(member);
  } else {
    console.error("member not found", characterName);
  }
}

function stopDrag() {
  dragging.value = false;
}

const alert = ref<IAlert | undefined>();

watch(
  () => [error.value, warning.value, success.value],
  () => {
    if (error.value) {
      alert.value = { type: "error", message: error.value };
      useTimeoutFn(() => {
        alert.value = undefined;
        error.value = null;
      }, 2500);
    } else if (warning.value) {
      alert.value = {
        type: "warning",
        message: warning.value,
      };
      useTimeoutFn(() => {
        alert.value = undefined;
        warning.value = null;
      }, 2500);
    } else if (success.value) {
      alert.value = {
        type: "success",
        message: success.value,
      };
      useTimeoutFn(() => {
        alert.value = undefined;
        success.value = null;
      }, 2500);
    }
  }
);

let lastTap: number;
let tapTimeout: number;
function handleTap(event: TouchEvent, member: Member) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  clearTimeout(tapTimeout);
  if (tapLength < 500 && tapLength > 0) {
    selectedMembers.value.push(member);
    event.preventDefault();
  } else {
    tapTimeout = setTimeout(() => {
      clearTimeout(tapTimeout);
    }, 500);
  }
  lastTap = currentTime;
}

function removeTeam(index: number) {
  // remove team
  const [team] = teams.value.splice(index, 1);
  // them.. remove picked members
  for (let x = 0; x < team.members.length; x++) {
    const member = team.members[x];
    const index = pickedMembers.value.findIndex(
      (pickedMember) => member === pickedMember
    );
    pickedMembers.value.splice(index, 1);
  }
}
</script>

<template>
  <div
    class="w-full h-full"
    @drop="stopDrag()"
    @dragover.prevent
    @dragenter.prevent
  >
    <ModalInfo :show="showInfo" @close="showInfo = false" />
    <ModalSettings
      :show="showSettings || !region || !realm || !guild"
      :prevent-close="!region || !realm || !guild"
      @close="showSettings = false"
      :region="region"
      :realm="realm"
      :guild="guild"
      :auto-pug="autoPug"
      :fancy="fancy"
      @update="
        (data: any) => {
          ({ region, realm, guild, autoPug, fancy } = data);
        }
      "
    />
    <TeamReveal
      v-if="revealTeam"
      :team="revealTeam"
      :number="teams.length + 1"
    />
    <Alert v-if="fatal" type="error" :fixed="true">
      {{ fatal }}
    </Alert>
    <Alert v-else-if="alert" :type="alert.type" :fixed="true" :timeout="4000">
      {{ alert.message }}
    </Alert>
    <Alert v-else-if="!region || !realm || !guild" :fixed="true" type="warning">
      Please select a region, realm and guild.
    </Alert>
    <Alert
      v-else-if="selectedMembers.length < minPlayers"
      :fixed="true"
      type="warning"
    >
      Select {{ minPlayers - selectedMembers.length }} more players
    </Alert>
    <a
      href="https://raider.io"
      target="_blank"
      rel="noreferrer"
      class="underline"
      ><RaiderIO title="powered by" class="fixed bottom-1.5 right-1.5 h-6 z-10"
    /></a>
    <div class="flex items-center gap-2 absolute top-2 right-2">
      <QuestionMarkCircleIcon
        @click="showInfo = !showInfo"
        class="h-5 cursor-pointer"
        :class="{
          'text-gray-400 hover:text-gray-300': !showInfo,
          'text-raiderio': showInfo,
        }"
      />
      <Cog6ToothIcon
        @click="showSettings = !showSettings"
        class="h-5 cursor-pointer"
        :class="{
          'text-gray-400 hover:text-gray-300': !showSettings,
          'text-raiderio': showSettings,
        }"
      />
    </div>
    <div class="flex flex-col w-full pb-10 p-2">
      <div
        class="flex flex-col md:flex-row justify-start gap-4 w-full bg-[#353535]"
      >
        <div class="flex flex-col order-3 md:order-1 gap-2">
          <div class="flex justify-between">
            <div class="font-bold text-gray-400">Roster</div>
            <Loader v-if="isFetching" />
          </div>
          <input
            v-model="filter"
            placeholder="Type to filter"
            class="text-gray-400 border rounded-md border-gray-400 bg-[#353535] px-2 py-1"
          />
          <!-- <RankFilter @update="rank = $event" :rank="rank" /> -->
          <RoleFilter @update="role = $event" :role="role" />
          <div class="w-full flex text-gray-400 text-sm">
            Double click to select players
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-1 gap-x-4"
            :class="{ 'opacity-40': isFetching }"
          >
            <div
              class="flex justify-between hover:bg-[#454545] cursor-pointer py-1"
              v-for="member in filteredMembers"
              :key="member.character.name"
              :draggable="true"
              @dblclick="selectedMembers.push(member)"
              @touchstart="handleTap($event, member)"
              @dragstart="startDrag($event, member)"
            >
              <Player :character="member.character" />
              <span title="Add">
                <PlusIcon class="h-6 text-gray-400 hover:text-gray-300" />
              </span>
            </div>
          </div>
          <Alert type="warning" v-if="!filteredMembers.length">
            No matching players
          </Alert>
        </div>
        <div
          class="flex flex-col order-1 md:order-2"
          @drop="onDrop($event)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div class="font-bold text-gray-400">Players</div>
          <div
            class="border border-dashed rounded-md h-[94px] w-full md:w-64 my-2 flex items-center justify-center text-sm font-bold transition-colors"
            :class="[
              dragging
                ? 'border-green-600 text-green-600'
                : 'border-gray-400 text-gray-400',
            ]"
          >
            Drag &amp; drop players here
          </div>
          <div
            class="flex justify-between py-1"
            v-for="member in selectedMembers"
            :key="member.character.name"
          >
            <Player :character="member.character" :pug="member.pug" />
            <div class="flex items-center">
              <span title="Toggle team captain">
                <StarIcon
                  @click="toggleCaptain(member)"
                  class="h-5 cursor-pointer"
                  :class="{
                    'text-gray-400 hover:text-gray-300': !member.captain,
                    'text-raiderio': member.captain,
                  }"
                />
              </span>
              <span title="Toggle spec">
                <ArrowPathRoundedSquareIcon
                  @click="toggleSpec(member)"
                  class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
                />
              </span>
              <span title="Remove">
                <XMarkIcon
                  @click="remove(member)"
                  class="h-6 text-gray-400 hover:text-gray-300 cursor-pointer"
                />
              </span>
            </div>
          </div>
          <div class="flex gap-2 justify-between w-full">
            <div class="text-gray-400 font-bold">
              {{ rolesText }}
            </div>
          </div>
          <div class="flex justify-between gap-2 mt-2">
            <Btn
              :disabled="selectedMembers.length < minPlayers"
              @click="randomise()"
              class="font-bold"
            >
              PICK TEAMS
            </Btn>
            <div class="flex gap-2">
              <Btn v-if="!autoPug" @click="addPug()" class="font-bold">
                PUG
              </Btn>
              <Btn
                :disabled="!selectedMembers.length && !teams.length"
                @click="reset()"
                class="font-bold"
              >
                RESET
              </Btn>
            </div>
          </div>
        </div>
        <div
          v-if="showTeams && teams.length"
          class="flex flex-wrap h-max order-2 md:order-3 gap-2 gap-x-4 mt-8"
        >
          <div
            class="flex flex-col gap-2"
            v-for="(team, index) in teams"
            :key="team.id"
          >
            <PlayerTeam
              :members="team.members"
              :index="index"
              @remove="removeTeam(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
