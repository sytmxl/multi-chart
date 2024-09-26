<template>
  <div class="relative flex-2 overflow-y-auto w-8/12" ref="imageContainer">
    <h3 class="text-3xl mb-4">Image</h3>
    <div class="relative">
      <img
        :src="imageUrl"
        :alt="fileName"
        @load="onImgLoad"
        ref="mainImage"
        class="max-w-full max-h-full object-contain rounded-md"
        :style="{ width: `${imgSize.width}px`, height: `${imgSize.height}px` }"
      />
      <div class="absolute inset-0">
        <div
          v-for="(box, index) in localBoxes"
          :key="index"
          class="absolute border-2"
          :style="getBoxStyle(box)"
          draggable="true" 
          @dragstart="onDragStart(index)"
          @dragover.prevent 
          @drop="onDrop(index)"
        >
          <div class="absolute top-0 right-0 primary rounded-xl px-2 py-1 text-xs">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4">

      <button 
        class="mt-4 p-2 rounded"
        @click="exportSwapInfo"
      >
        Export Swap Info
      </button>
      <button 
        class="mt-4 ml-4 p-2 rounded"
        @click="deleteSwapInfo"
      >
        Delete Swap Info
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'ImageContainer',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    boxes: {
      type: Array,
      required: true
    },
  },
  setup(props) {
    const imageContainer = ref(null);
    const mainImage = ref(null);
    const imgSize = ref({ width: 0, height: 0 });
    const imageDimensions = ref({ width: 1, height: 1 });

    const draggedBoxIndex = ref(null);
    const swapInfo = ref([]);
    const localBoxes = ref([...props.boxes]);  

    const onImgLoad = () => {
      localBoxes.value = [...props.boxes];

      const img = mainImage.value;
      const container = imageContainer.value;
      if (!img || !container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const containerAspectRatio = containerWidth / containerHeight;

      let newWidth, newHeight;
      if (imgAspectRatio > containerAspectRatio) {
        newWidth = containerWidth;
        newHeight = containerWidth / imgAspectRatio;
      } else {
        newHeight = containerHeight;
        newWidth = containerHeight * imgAspectRatio;
      }

      imgSize.value = { width: Math.floor(newWidth), height: Math.floor(newHeight) };
      imageDimensions.value = { width: img.naturalWidth, height: img.naturalHeight };

      loadSwapInfo();
    };

    const getBoxStyle = (box) => {
      box = box[1];
      const scale = {
        x: imgSize.value.width / imageDimensions.value.width,
        y: imgSize.value.height / imageDimensions.value.height
      };
      return {
        left: `${box[0] * scale.x}px`,
        top: `${box[1] * scale.y}px`,
        width: `${(box[2] - box[0]) * scale.x}px`,
        height: `${(box[3] - box[1]) * scale.y}px`,
        borderColor: getColorForVisType(),
        backgroundColor: `${getColorForVisType()}4D`,
      };
    };

    const getColorForVisType = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      return rootStyles.getPropertyValue('--md-sys-color-primary-container');
    };

    const onDragStart = (index) => {
      draggedBoxIndex.value = index;
    };

    const onDrop = (dropIndex) => {
      const dragIndex = draggedBoxIndex.value;
      if (dragIndex !== null && dragIndex !== dropIndex) {
        [localBoxes.value[dragIndex], localBoxes.value[dropIndex]] = [localBoxes.value[dropIndex], localBoxes.value[dragIndex]];
        saveSwapInfo(props.fileName, dragIndex, dropIndex);
        draggedBoxIndex.value = null;
      }
    };

    const saveSwapInfo = (fileName, dragIndex, dropIndex) => {
      const info = {
        fileName,
        swap: { from: dragIndex, to: dropIndex },
        timestamp: new Date().toISOString()
      };
      swapInfo.value.push(info);
      localStorage.setItem('swapInfo', JSON.stringify(swapInfo.value));
    };

    const exportSwapInfo = () => {
      const dataStr = JSON.stringify(swapInfo.value, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swap_info.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    const loadSwapInfo = () => {
      const savedSwapInfo = localStorage.getItem('swapInfo');
      if (savedSwapInfo) {
        swapInfo.value = JSON.parse(savedSwapInfo);
        swapInfo.value.forEach((info) => {
          if (info.fileName === props.fileName) {
            const { from, to } = info.swap;
            [localBoxes.value[from], localBoxes.value[to]] = [localBoxes.value[to], localBoxes.value[from]];
          }
        });
      }
    };

    const deleteSwapInfo = () => {
      const savedSwapInfo = localStorage.getItem('swapInfo');
      if (savedSwapInfo) {
        let swapInfoList = JSON.parse(savedSwapInfo);
        swapInfoList = swapInfoList.filter(info => info.fileName !== props.fileName);
        localStorage.setItem('swapInfo', JSON.stringify(swapInfoList));
        swapInfo.value = swapInfoList;
      }
      localBoxes.value = props.boxes;
    };
    onMounted(() => {
      const resizeObserver = new ResizeObserver(() => {
        onImgLoad();
      });
      if (imageContainer.value) {
        resizeObserver.observe(imageContainer.value);
      }
    });

    return {
      imageContainer,
      mainImage,
      imgSize,
      localBoxes,
      getBoxStyle,
      onDragStart,
      onDrop,
      exportSwapInfo,
      onImgLoad,
      deleteSwapInfo
    };
  }
};
</script>
