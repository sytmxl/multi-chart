<template>
  <div v-if="currentImage" class="flex flex-col h-screen p-5 box-border">
    <TagManagement 
      :current-image-tags="imageTags"
      :reusable-tags="reusableTags"
      :vis-types="Object.keys(currentImage.visualization_bbox)"
      @add-tag="handleAddTag"
      @remove-tag="handleRemoveTag"
      @export-tags="exportTags"
      @import-tags="importTags"
    />
    
    <OriginalCaption :caption="currentImage.caption" />
    
    <div class="flex flex-1 gap-5 overflow-hidden">
      <ImageContainer 
        :image-url="getImageUrl(currentImage)" 
        :file-name="currentImage.file_name" 
        :boxes="flattenedBoxes" 
        :visibility-state="visibilityState"
        @img-load="onImgLoad"
      />
      
      <Sidebar 
        :visualization-types="Object.keys(currentImage.visualization_bbox)" 
        :visibility-state="visibilityState"
        :captions="currentImage.captions"
        @toggle-visibility="toggleVisibility"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import OriginalCaption from './detail-view/OriginalCaption.vue';
import ImageContainer from './detail-view/ImageContainer.vue';
import Sidebar from './detail-view/Sidebar.vue';
import TagManagement from './detail-view/TagManagement.vue';
import { useLocalTagManagement } from '../composables/useLocalTagManagement';
import { getImageUrl } from '../utils';
export default {
  name: 'ImageDetailView',
  components: {
    OriginalCaption,
    ImageContainer,
    Sidebar,
    TagManagement
  },
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  emits: ['next-untagged'],
  setup(props, { emit }) {
    const { 
      reusableTags, 
      currentImageTags,
      addTag,
      removeTag,
      exportTags,
      importTags,
    } = useLocalTagManagement();

    const imageName = () => {
      return props.image.file_name.replace('.png', '');
    };
    const handleAddTag = (tag) => {
      addTag(imageName(), tag);
    };
    const handleRemoveTag = (tag) => {
      removeTag(imageName(), tag);
    };
    const imageTags = computed(() => {
      return currentImageTags.value[imageName()] || [];
    });

    const imgSize = ref({ width: 0, height: 0 });
    const visibilityState = ref({});
    const imageDimensions = ref({ width: 1, height: 1 });

    const currentImage = computed(() => {
      return props.image;
    });
   

    const flattenedBoxes = computed(() => {
      if (!currentImage.value) return [];
      return Object.entries(currentImage.value.visualization_bbox);
    });

    const onImgLoad = (dimensions) => {
      imgSize.value = dimensions.containerSize;
      imageDimensions.value = dimensions.naturalSize;
    };

    const toggleVisibility = (visType) => {
      visibilityState.value[visType] = !visibilityState.value[visType];
    };

    onMounted(() => {
      if (currentImage.value) {
        Object.keys(currentImage.value.visualization_bbox).forEach(visType => {
          visibilityState.value[visType] = true;
        });
      }
    });

    watch(() => props.image, (newImage) => {
      if (newImage) {
        Object.keys(newImage.visualization_bbox).forEach(visType => {
          visibilityState.value[visType] = true;
        });
      }
    }, { deep: true });

    return {
      currentImage,
      flattenedBoxes,
      visibilityState,
      getImageUrl,
      onImgLoad,
      toggleVisibility,
      reusableTags,
      imageTags,
      handleAddTag,
      handleRemoveTag,
      exportTags,
      importTags,
    };
  },
};
</script>
