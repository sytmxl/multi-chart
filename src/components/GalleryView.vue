<template>
  <div class="h-screen flex flex-col overflow-hidden p-4" ref="galleryRef">
    <h3 class="text-3xl mb-4">Gallery</h3>
    <div class="flex flex-col gap-2 justify-between items-center mb-4">
      <div class="flex flex-row items-center">
        <span class="mr-2">Current Image: {{ allImages[currentIndex]?.file_name }}</span>
        <button @click="copyImageNumber(allImages[currentIndex]?.file_name.replace('.png', ''))" class="px-2 py-1 primary rounded-full">
          Copy
        </button>
      </div>
      <div class="flex flex-row w-full items-center">
        <input
          v-model="jumpToImage"
          @keyup.enter="handleJumpToImage"
          placeholder="Enter image number (e.g., 1023_05)"
          class="px-2 py-1 border w-full rounded mr-2 surface"
        />
        <button @click="handleJumpToImage" class="px-2 py-1 primary rounded-full">
          Jump
        </button>
      </div>
    </div>
    <div class="flex-grow overflow-y-auto rounded-2xl">
      <div class="grid grid-cols-3 gap-4 surface-variant p-4 rounded-2xl">
        <div
          v-for="(image, index) in displayedImages"
          :key="index"
          :class="{
            'aspect-square overflow-hidden rounded-lg hover:shadow-xl transition-transform duration-300': true,
            ' shadow-lg border-cyan-200 border-4': isCurrentImage(index)
          }"
        >
          <img
            :src="getImageUrl(image)"
            @click="emit('openDetail', index)"
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
import { ref, computed, onMounted, onUnmounted, watch, onBeforeMount } from 'vue';
import { getImageUrl } from '../utils';
import loadData from '../utils';
const emit = defineEmits(['openDetail']);

const pageSize = 20;
const currentPage = ref(1);
const loadingTrigger = ref(null);
const loading = ref(false);
const jumpToImage = ref('');

const props = defineProps({
  currentIndex: Number, 
});

const allImages = ref([])

onBeforeMount(async () => {
  allImages.value = await loadData(); // Fetch data on component mount
});

const displayedImages = computed(() => {
  return allImages.value.slice(0, currentPage.value * pageSize);
});

const allImagesLoaded = computed(() => {
  return displayedImages.value.length >= allImages.value.length;
});

const isCurrentImage = (index) => {
  return index === props.currentIndex;
};

const copyImageNumber = (input) => {
  navigator.clipboard.writeText(input)
    .catch(err => console.error('Failed to copy: ', err));
};

const handleJumpToImage = () => {
  const imageName = jumpToImage.value.trim();
  const fileName = imageName.endsWith('.png') ? imageName : `${imageName}.png`;
  if (fileName) {
    const targetImageIndex = allImages.value.findIndex(img => img.file_name == fileName);
    if (targetImageIndex) {
      emit('openDetail', targetImageIndex);
      jumpToImage.value = '';
    } else {
      alert('Image not found. Please enter a valid image number.');
    }
  } else {
    alert('Invalid input. Please use the format "id-index" (e.g., "1-0").');
  }
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
