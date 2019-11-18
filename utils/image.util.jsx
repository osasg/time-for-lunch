export function getDataUri(url, callback) {
  const image = new Image();

  image.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    canvas.getContext('2d').drawImage(this, 0, 0);

    callback(canvas.toDataURL('image/png'));
  };

  image.src = url;
}