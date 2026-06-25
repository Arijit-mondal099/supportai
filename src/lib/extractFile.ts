export const SUPPORTED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv"];

export class UnsupportedFileError extends Error {}

function ensureGlobalPolyfills(): void {
  if (typeof globalThis.DOMMatrix === "undefined") {
    class SimpleDOMMatrix {
      a = 1;
      b = 0;
      c = 0;
      d = 1;
      e = 0;
      f = 0;
      constructor(transform?: number[] | Float64Array | string) {
        if (!transform) return;
        if (typeof transform === "string") {
          const m = transform.match(/matrix\(([^)]+)\)/);
          if (m) {
            const vals = m[1].split(",").map(Number);
            [this.a, this.b, this.c, this.d, this.e, this.f] = vals;
          }
        } else {
          [this.a, this.b, this.c, this.d, this.e, this.f] = Array.from(transform as number[]);
        }
      }
      translate(x: number, y: number) {
        this.e += x;
        this.f += y;
        return this;
      }
      scale(sx: number, sy: number) {
        this.a *= sx;
        this.d *= sy;
        return this;
      }
      invertSelf() {
        return this;
      }
      multiplySelf(_other: SimpleDOMMatrix) {
        return this;
      }
      preMultiplySelf(_other: SimpleDOMMatrix) {
        return this;
      }
    }
    globalThis.DOMMatrix = SimpleDOMMatrix as unknown as typeof globalThis.DOMMatrix;
  }

  if (typeof globalThis.ImageData === "undefined") {
    class SimpleImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      constructor(dataOrWidth: Uint8ClampedArray | number, height?: number) {
        if (typeof dataOrWidth === "number") {
          this.width = dataOrWidth;
          this.height = height ?? dataOrWidth;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        } else {
          this.data = dataOrWidth;
          this.width = 0;
          this.height = 0;
        }
      }
    }
    globalThis.ImageData = SimpleImageData as unknown as typeof globalThis.ImageData;
  }

  if (typeof globalThis.Path2D === "undefined") {
    class SimplePath2D {
      addPath() {
        return this;
      }
    }
    globalThis.Path2D = SimplePath2D as unknown as typeof globalThis.Path2D;
  }
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const arrayBuffer = await file.arrayBuffer();

  if (ext === "pdf") {
    ensureGlobalPolyfills();
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
    const result = await parser.getText();
    return result.text ?? "";
  }

  if (ext === "docx") {
    const { extractRawText } = await import("mammoth");
    const result = await extractRawText({ buffer: Buffer.from(arrayBuffer) });
    return result.value ?? "";
  }

  if (ext === "txt" || ext === "md" || ext === "csv") {
    return Buffer.from(arrayBuffer).toString("utf-8");
  }

  throw new UnsupportedFileError(ext);
};
