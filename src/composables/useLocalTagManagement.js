import { ref, watch } from 'vue';

// Fixed reusable tags
const reusableTags = ['X'];

const CURRENT_IMAGE_TAGS_KEY = 'current-image-tags';

export function useLocalTagManagement() {
  const currentImageTags = ref(loadTags() || {});

  watch(currentImageTags, () => saveTags(), { deep: true });

  function loadTags() {
    const storedTags = localStorage.getItem(CURRENT_IMAGE_TAGS_KEY);
    return storedTags ? JSON.parse(storedTags) : {};
  }

  function saveTags() {
    localStorage.setItem(CURRENT_IMAGE_TAGS_KEY, JSON.stringify(currentImageTags.value));
  }

  function addTag(imageName, tag) {
    if (!currentImageTags.value[imageName]) {
      currentImageTags.value[imageName] = [];
    }
    if (currentImageTags.value[imageName].includes(tag)) {
      removeTag(imageName, tag)
    } else {
      currentImageTags.value[imageName].push(tag);
    }
  }

  function removeTag(imageName, tag) {
    const imageTags = currentImageTags.value[imageName];
    if (imageTags) {
      const index = imageTags.indexOf(tag);
      if (index !== -1) {
        imageTags.splice(index, 1);
      }
    }
  }

  function exportTags() {
    const dataStr = JSON.stringify(currentImageTags.value, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'image-tags.json');
    linkElement.click();
  }

  function importTags(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedTags = JSON.parse(e.target.result);
        if (typeof importedTags === 'object') {
          currentImageTags.value = importedTags;
        }
      } catch (error) {
        console.error('Error parsing imported tags:', error);
      }
    };

    reader.readAsText(file);
  }

  return {
    reusableTags,
    currentImageTags,
    addTag,
    removeTag,
    exportTags,
    importTags,
  };
}
