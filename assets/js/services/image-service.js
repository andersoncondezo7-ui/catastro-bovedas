import { APP_CONFIG } from "../config.js";

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function imageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, width: image.naturalWidth, height: image.naturalHeight, cleanup: () => URL.revokeObjectURL(url) });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`No fue posible procesar ${file.name}.`));
    };
    image.src = url;
  });
}

async function compressImage(file) {
  if (file.size > APP_CONFIG.photos.maxInputBytes) {
    throw new Error(`La foto ${file.name} supera el límite de ${APP_CONFIG.photos.maxInputMB} MB.`);
  }

  let source;
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file);
      source = { image: bitmap, width: bitmap.width, height: bitmap.height, cleanup: () => bitmap.close() };
    } catch {
      source = await imageFromFile(file);
    }
  } else {
    source = await imageFromFile(file);
  }

  const scale = Math.min(1, APP_CONFIG.photos.maxDimension / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d", { alpha: false }).drawImage(source.image, 0, 0, width, height);
  source.cleanup();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", APP_CONFIG.photos.jpegQuality));
  if (!blob) throw new Error(`No fue posible comprimir ${file.name}.`);
  return {
    blob,
    width,
    height,
    originalSizeBytes: file.size,
  };
}

function safeName(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function preparePhotos(fields, form, assetNumber, onProgress = () => {}) {
  const photos = [];
  const selections = fields.flatMap((field) => {
    const input = form.elements[field.id];
    return [...(input?.files || [])].map((file, index) => ({ field, file, index }));
  });

  let totalCompressedBytes = 0;
  for (let position = 0; position < selections.length; position += 1) {
    const { field, file, index } = selections[position];
    onProgress(position + 1, selections.length, field.label);
    const compressed = await compressImage(file);
    totalCompressedBytes += compressed.blob.size;
    if (totalCompressedBytes > APP_CONFIG.photos.maxPayloadBytes) {
      throw new Error(`Las fotos superan el límite total de ${APP_CONFIG.photos.maxPayloadMB} MB. Reduce la cantidad o resolución.`);
    }
    const contentBase64 = toBase64(await compressed.blob.arrayBuffer());
    photos.push({
      fieldId: field.id,
      category: field.group || "Fotos",
      label: field.label,
      sequence: index + 1,
      fileName: `${safeName(assetNumber)}_${safeName(field.id)}_${String(index + 1).padStart(2, "0")}.jpg`,
      mimeType: "image/jpeg",
      width: compressed.width,
      height: compressed.height,
      sizeBytes: compressed.blob.size,
      originalFileName: file.name,
      originalSizeBytes: compressed.originalSizeBytes,
      contentBase64,
    });
  }
  return photos;
}
