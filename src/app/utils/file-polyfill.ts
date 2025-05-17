// Polyfill for File API
export function setupFilePolyfill() {
  if (typeof globalThis.File === 'undefined') {
    try {
      // @ts-ignore
      globalThis.File = class File extends Blob {
        name: string;
        lastModified: number;

        constructor(
          bits: BlobPart[], 
          name: string, 
          options?: FilePropertyBag
        ) {
          super(bits, options);
          this.name = name;
          this.lastModified = options?.lastModified || Date.now();
        }
      };
    } catch (error) {
      console.error('Failed to set up File polyfill:', error);
    }
  }
}