<template>
  <div class="mb-4">
    <div class="mb-2 flex flex-row justify-between">
      <div class="flex flex-row items-center">
        <h3 class="font-bold mb-1">Present image tag：</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="(tag, index) in currentImageTags" 
            :key="tag"
            @click="() => $emit('remove-tag', tag)"
            class="px-2 py-1 primary rounded-full opacity-90 text-sm hover:opacity-100"
          >
            {{ tag }} ×
          </button>
        </div>
      </div>
      <div class="flex flex-row justify-center items-center gap-2 mt-4">
        <label class="px-4 py-1 primary-variant rounded cursor-pointer hover:opacity-90">
          Import
          <input 
            type="file" 
            @change="$emit('import-tags', $event)"
            accept=".json"
            class="hidden"
          />
        </label>
        <button 
          @click="$emit('export-tags')" 
          class="px-4 py-1 primary rounded hover:opacity-90"
        >
          Export
        </button>
      </div>
    </div>
    
    <div class="mb-2 flex flex-row items-center">
      <h3 class="font-bold mb-1">Tag options：</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="(tag, index) in allTags" 
          :key="tag"
          @click="() => $emit('add-tag', tag)"
          class="px-2 py-1 flex flex-row rounded-full secondary gap-1 opacity-80 text-sm hover:opacity-100"
        >
          <div>{{ tag }}</div>
          <div class="secondary-container opacity-50 px-2 rounded-full">{{ index + 1 }}</div>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'TagManagement',
  props: {
    currentImageTags: {
      type: Array,
      default: () => [],
    },
    reusableTags: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['add-tag', 'remove-tag', 'export-tags', 'import-tags'],
  setup(props, { emit }) {
    const newTag = ref('');

    const allTags = computed(() => {
      // Only use reusableTags now that visTypes is removed
      return [...props.reusableTags];
    });

    const handleAddTag = () => {
      if (newTag.value.trim()) {
        emit('add-tag', newTag.value.trim());
        newTag.value = '';
      }
    };

    const handleKeyPress = (event) => {
      const index = parseInt(event.key, 10) - 1;
      if (index >= 0 && index < allTags.value.length) {
        // console.log(index)
        // console.log(allTags.value)
        emit('add-tag', allTags.value[index]);
      }
    };

    onMounted(() => {
      // document.addEventListener('keypress', handleKeyPress);
    });

    return {
      newTag,
      handleAddTag,
      allTags,
    };
  },
  beforeUnmount() {
    document.removeEventListener('keypress', handleKeyPress);
  },
};
</script>
