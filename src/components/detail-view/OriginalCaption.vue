<template>
  <div class="flex flex-col mb-5 gap-4">
    <h3 class="text-3xl">Original caption</h3>
    <div class="surface-variant p-4 rounded-2xl">
      <p>{{ caption }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OriginalCaption',
  props: {
    caption: {
      type: String,
      required: true
    }
  }
};
</script>