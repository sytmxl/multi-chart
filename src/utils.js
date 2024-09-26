export const getImageUrl = (image) => {
  if (!image || !image.file_name) {
    return '';
  }
  const fileName = image.file_name;
  const baseName = fileName.replace('.png', '');
  const [id, imageId] = baseName.split('_').map(Number);

  const prefix1 = 'https://mosycdn.oss-rg-china-mainland.aliyuncs.com/images/'; // aliyun cdn
  const prefix2 = 'https://github.com/VisImages/visimages-image-data/blob/main/'; // original github source(really slow, not recommended)
  const prefix3 = 'http://127.0.0.1:5500/'; // localhost(fastest, but need to download and host files first. download at https://drive.google.com/file/d/1cr9-zp4uwHNgY4xho134zBbR7CUiUYZp/view?usp=sharing)
  // Construct and return the URL
  return prefix3 + `${id}/${imageId}.png`;
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Error fetching data:', e);
    return null;
  }
}

const ossPrefix = 'https://mosycdn.oss-rg-china-mainland.aliyuncs.com/';

const loadData = async () => {
  // simplified_captions.json (4433) alpha.json (912) beta.json (103)
  const remoteFile = 'beta.json';
  const remoteData = await fetchData(ossPrefix + remoteFile);

  // Choose to load local data or remote data
  const data = remoteData;
  return data;
};
export default loadData; // Export the promise

