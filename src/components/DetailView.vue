<template>
  <div v-if="currentImage" class="flex flex-col h-screen p-5 box-border">
    <div class="flex flex-col mb-5 gap-4">
      <h3 class=" text-3xl ">Original caption</h3>
      <div class="surface-variant p-4 rounded-2xl">
        <p class="">{{ currentImage.caption }}</p>
      </div>
    </div>
    <div class="flex flex-1 gap-5 overflow-hidden">
      <div class="relative flex-2 overflow-hidden w-8/12" ref="imageContainer">
        <h3 class="text-3xl  mb-4">Image</h3>
        <img
          :src="getImageUrl()"
          :alt="currentImage.file_name"
          @load="onImgLoad"
          ref="mainImage"
          class="max-w-full max-h-full object-contain rounded-md"
        />
        <!-- visualization_bbox -->
        <div class="absolute inset-0" :style="{ width: `${imgSize[0]}px`, height: `${imgSize[1]}px` }">
          <div
            v-for="(boxes, visType) in currentImage.visualization_bbox"
            :key="visType"
          >
            <div
              v-for="(box, index) in boxes"
              :key="`${visType}-${index}`"
              class="absolute border-2 border-red"
              :style="getBoxStyle(box, visType)"
            >
              <div class="absolute top-0 right-0 bg-black bg-opacity-60 text-red px-2 py-1 text-xs">{{ visType }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-5 overflow-y-auto w-4/12">
        <h3 class="text-3xl ">Processed captions</h3>
        <div v-for="(caption, index) in currentImage.captions" :key="index" class="surface-variant p-4 rounded-2xl">
          <p class="">{{ caption }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import processedCaptions from '../assets/processed_captions.json';

export default {
  name: 'DetailView',
  props: {
    imageId: {
      type: Number,
      default: 1022,
    },
    imageIndex: {
      type: Number,
      default: 8,
    },
  },
  data() {
    return {
      imgSize: [0, 0],
      visibilityState: {},
    };
  },
  computed: {
    currentImage() {
      const images = processedCaptions[this.imageId];
      return images ? images[this.imageIndex] : null;
    },
  },
  methods: {
    onImgLoad() {
      const img = this.$refs.mainImage;
      const container = this.$refs.imageContainer;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight);
      this.imgSize = [scale * img.naturalWidth, scale * img.naturalHeight];
    },
    getImageUrl() {
      return `https://github.com/VisImages/visimages-image-data/blob/main/${this.imageId}/${this.currentImage.image_id + 1}.png?raw=true`;
    },
    getBoxStyle(box, visType) {
      const color = this.getColorForVisType(visType);
      return {
        left: `${box[0] * 100}%`,
        top: `${box[1] * 100}%`,
        width: `${(box[2] - box[0]) * 100}%`,
        height: `${(box[3] - box[1]) * 100}%`,
        backgroundColor: `rgba(${color}, 0.3)`,
        visibility: this.visibilityState[visType] ? 'visible' : 'hidden',
      };
    },
    getColorForVisType(visType) {
      const colors = {
        heatmap: '255, 0, 0',
        scatterplot: '0, 255, 0',
        treemap: '0, 0, 255',
      };
      return colors[visType] || '128, 128, 128';
    },
    toggleVisibility(visType) {
      this.$set(this.visibilityState, visType, !this.visibilityState[visType]);
    },
    getVisCaptions(visType) {
      return this.currentImage.captions.filter((caption, index) => {
        return Object.keys(this.currentImage.nums_of_visualizations)[index] === visType;
      });
    },
    closeDetailView() {
      this.$emit('close');
    },
  },
  mounted() {
    if (this.currentImage) {
      Object.keys(this.currentImage.nums_of_visualizations).forEach(visType => {
        this.$set(this.visibilityState, visType, true);
      });
    }
  },
};
</script>

