<template>
    <div id="app" class="flex flex-row surface">
    <gallery-view @openDetail="openDetailView" class="w-3/12" />
    <detail-view 
      :imageId="selectedImageId" 
      :imageIndex="selectedImageIndex" 
      @close="closeDetailView" 
      class="w-9/12" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GalleryView from './components/GalleryView.vue';
import DetailView from './components/DetailView.vue';

const showDetailView = ref(false);
const selectedImageId = ref(null);
const selectedImageIndex = ref(null);

const openDetailView = (imageId, index) => {
  selectedImageId.value = imageId;
  selectedImageIndex.value = index;
  showDetailView.value = true;
};

const closeDetailView = () => {
  showDetailView.value = false;
};
</script>