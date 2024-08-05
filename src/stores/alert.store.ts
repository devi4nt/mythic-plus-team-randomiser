import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import { IAlert } from "@/types";

export const useAlertStore = defineStore("alert", () => {
  const fatal = ref<string>();
  const error = ref<string>();
  const warning = ref<string>();
  const success = ref<string>();
  const alert = ref<IAlert>();

  watch(
    () => [error.value, warning.value, success.value],
    () => {
      if (error.value) {
        alert.value = { type: "error", message: error.value };
        useTimeoutFn(() => {
          alert.value = undefined;
          error.value = undefined;
        }, 2500);
      } else if (warning.value) {
        alert.value = {
          type: "warning",
          message: warning.value,
        };
        useTimeoutFn(() => {
          alert.value = undefined;
          warning.value = undefined;
        }, 5000);
      } else if (success.value) {
        alert.value = {
          type: "success",
          message: success.value,
        };
        useTimeoutFn(() => {
          alert.value = undefined;
          success.value = undefined;
        }, 2500);
      }
    }
  );

  return {
    alert,
    fatal,
    error,
    warning,
    success,
  };
});
