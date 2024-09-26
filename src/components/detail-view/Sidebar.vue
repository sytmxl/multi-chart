<template>
  <div class="flex-1 flex flex-col gap-5 overflow-y-auto w-4/12">
    <h3 class="text-3xl mt-4"> {{ captions.length + ' Processed captions' }} </h3>
    <div v-for="(caption, index) in captions" :key="index" class="surface-variant p-4 rounded-2xl flex">
      <p>{{ caption }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    visualizationTypes: {
      type: Array,
      required: true
    },
    captions: {
      type: Array,
      required: true
    }
  },
};
</script>