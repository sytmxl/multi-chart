<template>
  <div class="flex flex-row w-full items-center gap-2">
    <select v-model="selectedVisType" class="px-2 py-1 border rounded surface">
      <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
    </select>
    <select v-model="tagFilter" class="px-2 py-1 border rounded surface">
      <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
    </select>
    <button @click="resetFilters" class="px-2 py-1 primary rounded-full">
      Reset Filters
    </button>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useLocalTagManagement } from '../../composables/useLocalTagManagement';

export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  emits: ['updateFilters'],
  setup(props, { emit }) {
    const { reusableTags } = useLocalTagManagement();
    const selectedVisType = ref('all');
    const tagFilter = ref('all');

    const allTags = computed(() => {
      const tagsSet = new Set(reusableTags);

      props.images.forEach(image => {
        if (image.tags) {
          image.tags.forEach(tag => tagsSet.add(tag));
        }
      });

      return ['all', ...Array.from(tagsSet)];
    });

    const resetFilters = () => {
      selectedVisType.value = 'all';
      tagFilter.value = 'all';
      emit('updateFilters', { selectedVisType: selectedVisType.value, tagFilter: tagFilter.value });
    };

    const updateFilters = () => {
      emit('updateFilters', { selectedVisType: selectedVisType.value, tagFilter: tagFilter.value });
    };

    watch([selectedVisType, tagFilter], updateFilters);

    return {
      selectedVisType,
      tagFilter,
      allTags,
      resetFilters,
    };
  },
};
</script>
