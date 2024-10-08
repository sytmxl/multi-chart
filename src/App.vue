<template>
  <div id="app" class="flex surface">
    <gallery-view 
      :currentIndex="currentIndex"
      @openDetail="openDetailView"
      class="w-3/12 " 
    />
    <!-- <div> {{ selectedImage }}</div> -->
    <detail-view 
      :image="selectedImage" 
      @next-untagged="navigateToNextUntaggedImage"
      class="w-9/12" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import loadData from './utils';
import { useLocalTagManagement } from './composables/useLocalTagManagement';
import DetailView from './components/DetailView.vue';
import GalleryView from './components/GalleryView.vue';
const { currentImageTags } = useLocalTagManagement();

const imageList = ref(null); // Reactive variable to hold the data
const selectedImage = ref(null);
// 当前图片的索引
const currentIndex = computed(() => {
  if (!imageList.value) return 0; // Guard clause to check if imageList is initialized
  return imageList.value?.findIndex(img => img.file_name === selectedImage.value?.file_name);
});
onBeforeMount(async () => {
  imageList.value = await loadData(); // Fetch data on component mount
  if (imageList.value.length > 0) {
    selectedImage.value = imageList.value[0];
  }
});

const openDetailView = (index) => {
  selectedImage.value = imageList.value[index];
};

// 导航到指定的图片
const navigateToImage = (step) => {
  let newIndex = currentIndex.value + step;
  if (newIndex >= 0 && newIndex < imageList.value.length) {
    selectedImage.value = imageList.value[newIndex];
  }
};

// 判断图片是否已打标签
const isImageTagged = (image) => {
  const tagKey = image.file_name.replace('.png', '');
  // console.log(tagKey)
  return currentImageTags.value[tagKey] && currentImageTags.value[tagKey].length > 0;
};

// 导航到下一个打标签的图片
const navigateToNextUntaggedImage = () => {
  for (let i = currentIndex.value + 1; i < imageList.value.length; i++) {
    if (isImageTagged(imageList.value[i])) {
      selectedImage.value = imageList.value[i];
      break;
    }
  }
};

// 导航到上一个打标签的图片
const navigateToPreviousUntaggedImage = () => {
  for (let i = currentIndex.value - 1; i >= 0; i--) {
    if (isImageTagged(imageList.value[i])) {
      selectedImage.value = imageList.value[i];
      break;
    }
  }
};

// 键盘快捷键处理
const handleKeydown = (event) => {
  if (event.key === 'ArrowDown') {
    navigateToNextUntaggedImage();
  } else if (event.key === 'ArrowUp') {
    navigateToPreviousUntaggedImage();
  } else if (event.key === 'ArrowRight') {
    navigateToImage(1);
  } else if (event.key === 'ArrowLeft') {
    navigateToImage(-1);
  }
};

// 监听键盘事件
window.addEventListener('keydown', handleKeydown);
</script>

