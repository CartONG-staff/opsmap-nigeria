<template lang="html">
  <div>
    <v-btn class="mx-2" fab dark small color="primary" @click="$emit('change')">
      <v-icon dark>
        mdi-dots-vertical
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMapBasemapPicker extends Vue {
  readonly basemap: string = "satellite-v9";
}
</script>
<style scoped></style>
