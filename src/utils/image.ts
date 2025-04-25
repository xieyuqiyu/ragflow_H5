const imageUtils = {
  // 图片压缩
  compress(file: File, options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}): Promise<Blob> {
    const { maxWidth = 800, maxHeight = 800, quality = 0.8 } = options;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          // 计算缩放比例
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          }, file.type, quality);
        };
        img.onerror = () => reject(new Error('Image load error'));
      };
      reader.onerror = () => reject(new Error('File read error'));
    });
  },

  // 图片转base64
  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  // 预加载图片
  preload(urls: string[]): Promise<HTMLImageElement[]> {
    const promises = urls.map(url => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    });
    
    return Promise.all(promises);
  }
};

export default imageUtils;