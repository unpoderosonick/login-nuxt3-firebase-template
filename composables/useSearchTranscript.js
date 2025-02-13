// ~/composables/useSearchTranscript.js
import { computed } from "vue";

export function useSearchTranscript(recordingData, searchTerm) {
  const highlightedTranscript = computed(() => {
    if (!searchTerm.value || !recordingData.value.transcript) {
      return recordingData.value.transcript || "";
    }

    const regex = new RegExp(`(${searchTerm.value})`, "gi");
    return recordingData.value.transcript.replace(
      regex,
      '<span class="search-highlight">$1</span>'
    );
  });

  return { highlightedTranscript };
}
