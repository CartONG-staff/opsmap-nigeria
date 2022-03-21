<template>
  <v-text-field
    class="search-field"
    :label="label"
    solo
    dense
    flat
    single-line
    hide-details
    clearable
    v-model="search"
    @keydown.enter="setSearchImmediate"
    prepend-inner-icon="mdi-magnify"
    height="44"
  ></v-text-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TKSearchField extends Vue {
  inheritAttrs = false;

  @Prop({ default: "" })
  label!: string;

  // search
  timeOutID = 0;

  @Prop({ default: "" })
  value!: string;

  _search = this.value;
  get search(): string {
    return this._search;
  }

  set search(search: string) {
    this._search = search;
    window.clearTimeout(this.timeOutID);
    if (search) {
      // text is typed
      this.timeOutID = window.setTimeout(() => {
        this.triggerSearch();
      }, 1000);
    } else {
      // test is cleared
      this.triggerSearch();
    }
  }

  setSearchImmediate() {
    window.clearTimeout(this.timeOutID);
    this.triggerSearch();
  }

  triggerSearch() {
    this.$emit("input", this._search);
  }
}
</script>

<style scoped>
.search-field {
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid var(--v-thematicBorder-base);
  width: 100%;
  background-color: var(--v-thematicBackground-base);
  overflow: hidden;
}
</style>
