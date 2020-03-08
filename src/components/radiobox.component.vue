<template>
  <v-radio-group class="ml-12">
    <v-radio
        v-for="label in labels"
        :key="label._id"
        :label="`${label.name}`"
        :value="label._id"
        v-model="todoObj.labeId"
    ></v-radio>
    </v-radio-group>
</template>

<script>
export default {
  name: 'radio-box',
  data() {
    return {
      labels: []
    };
  }
};
</script>

<style>

</style>
