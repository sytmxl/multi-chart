<template>
  <div class="h-screen flex flex-col overflow-hidden p-4" ref="galleryRef">
    <h3 class=" text-3xl mb-4">Gallary</h3>
    <div class="flex-grow overflow-y-auto rounded-2xl">
      <div class="grid grid-cols-3 gap-4 surface-variant p-4 rounded-2xl">
        <div
          v-for="image in displayedImages"
          :key="`${image.id}-${image.index}`"
          class="aspect-square overflow-hidden rounded-lg hover:shadow-xl transition-shadow duration-300"
        >
          <img
            :src="getImageUrl(image.id, image.image_id)"
            :alt="`Image ${image.image_id}`"
            @click="openDetailView(image.id, image.index)"
            class="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div 
          v-if="!allImagesLoaded" 
          ref="loadingTrigger" 
          class="text-center py-5 text-lg text-gray-600"
        >
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import processedCaptions from '../assets/processed_captions.json';

const emit = defineEmits(['openDetail']);

const pageSize = 12;
const currentPage = ref(1);
const loading = ref(false);
const galleryRef = ref(null);
const loadingTrigger = ref(null);

const allImages = computed(() => {
  return Object.entries(processedCaptions).flatMap(([id, images]) =>
    images.map((image, index) => ({ ...image, id, index }))
  );
});

const displayedImages = computed(() => {
  return allImages.value.slice(0, currentPage.value * pageSize);
});

const allImagesLoaded = computed(() => {
  return displayedImages.value.length >= allImages.value.length;
});

const getImageUrl = (imageId, imageNum) => {
  return `https://github.com/VisImages/visimages-image-data/blob/main/${imageId}/${imageNum+1}.png?raw=false`;
};

const openDetailView = (imageId, index) => {
  emit('openDetail', imageId, index);
};

const loadMore = () => {
  if (loading.value || allImagesLoaded.value) return;
  
  loading.value = true;
  setTimeout(() => {
    currentPage.value++;
    loading.value = false;
  }, 500);
};

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    { rootMargin: '50px' }
  );

  if (loadingTrigger.value) {
    observer.observe(loadingTrigger.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
