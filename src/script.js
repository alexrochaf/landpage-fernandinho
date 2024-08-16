const fileInput = document.getElementById('upload');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const photoImage = new Image();
    photoImage.crossOrigin = 'anonymous';
    photoImage.src = reader.result;
    photoImage.onload = () => {
      const frameImage = new Image();
      frameImage.crossOrigin = 'local';
      frameImage.src = 'frame.png'; // Path to the frame image
      frameImage.onload = () => {
        const mergedImageUrl = mergeImagesWithFrame(photoImage, frameImage);
        //clear button download
        const downloadContainer = document.getElementById('download-container');
        downloadContainer.innerHTML = '';
        //create button download
        createDownloadButton(mergedImageUrl);
      };
    };
  };

  reader.readAsDataURL(file);
});

function createDownloadButton(imageUrl) {
  const downloadContainer = document.getElementById('download-container');
  const downloadLink = document.createElement('a');
  downloadLink.type = 'button';
  downloadLink.className = 'btn btn-primary';
  downloadLink.href = imageUrl;
  const guid = generateGuid();
  downloadLink.download = `fernandinho-${guid}.jpg`; // Set the desired file name
  downloadLink.innerHTML = 'Download Merged Image';
  downloadContainer.appendChild(downloadLink);
}

function mergeImagesWithFrame(photoImage, frameImage) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const photoAspectRatio = photoImage.width / photoImage.height;
  const frameAspectRatio = frameImage.width / frameImage.height;

  let croppedPhotoWidth, croppedPhotoHeight;

  if (photoAspectRatio > frameAspectRatio) {
    // Photo is wider than the frame, crop the width
    croppedPhotoWidth = frameImage.width;
    croppedPhotoHeight = frameImage.width / photoAspectRatio;
  } else {
    // Photo is taller than the frame, crop the height
    croppedPhotoHeight = frameImage.height;
    croppedPhotoWidth = frameImage.height * photoAspectRatio;
  }

  canvas.width = frameImage.width;
  canvas.height = frameImage.height;

  // Draw the cropped photo image onto the canvas
  ctx.drawImage(
    photoImage,
    0,
    0,
    photoImage.width,
    photoImage.height,
    (frameImage.width - croppedPhotoWidth) / 2,
    (frameImage.height - croppedPhotoHeight) / 2,
    croppedPhotoWidth,
    croppedPhotoHeight
  );

  // Draw the frame image onto the canvas
  ctx.drawImage(frameImage, 0, 0);

  return canvas.toDataURL('image/jpeg');
}

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}