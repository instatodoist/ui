<template>
  <div>
    <app-header />
    <v-content style="min-height: 600px;">
      <v-container>
        <slot />
      </v-container>
    </v-content>
    <app-footer />
  </div>
</template>

<script>
import AppFooter from "../components/layouts/AppFooter.vue";
import AppHeader from "../components/layouts/AppHeader.vue";
export default {
  name: "DefaultLayout",
  components: {
    AppFooter,
    AppHeader
  }
};
</script>
