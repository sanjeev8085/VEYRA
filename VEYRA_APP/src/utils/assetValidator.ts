/**
 * VEYRA 3D Asset Validator & Performance Inspector
 * Inspects .glb and .gltf assets for geometric complexity, file size,
 * texture constraints, and calculates a luxury WebGL performance health grade.
 */

export interface AssetValidationMetrics {
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  format: 'glb' | 'gltf' | 'unknown';
  isBinaryGLB: boolean;
  version: string;
  triangleCount: number;
  vertexCount: number;
  meshCount: number;
  materialCount: number;
  textureCount: number;
  hasDracoCompression: boolean;
  hasMeshoptCompression: boolean;
  hasPBRMaterials: boolean;
}

export type PerformanceGrade = 'A+' | 'A' | 'B' | 'C' | 'F';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  suggestion?: string;
}

export interface AssetValidationResult {
  isValid: boolean;
  grade: PerformanceGrade;
  healthScore: number; // 0 to 100
  summary: string;
  metrics: AssetValidationMetrics;
  issues: ValidationIssue[];
}

// Performance thresholds for high-end luxury e-commerce WebGL
const THRESHOLDS = {
  MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB hard limit
  WARN_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB warning
  OPTIMAL_FILE_SIZE_BYTES: 4 * 1024 * 1024, // 4 MB optimal
  MAX_TRIANGLES: 120000, // 120k tris hard limit
  WARN_TRIANGLES: 60000, // 60k tris warning
  OPTIMAL_TRIANGLES: 35000, // 35k tris optimal for mobile 60fps
  MAX_TEXTURE_COUNT: 8,
};

/**
 * Format bytes into human-readable MB / KB
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Inspect raw ArrayBuffer of a .glb file
 */
export const validate3DAssetBuffer = (buffer: ArrayBuffer, fileName = 'model.glb'): AssetValidationResult => {
  const issues: ValidationIssue[] = [];
  const fileSizeBytes = buffer.byteLength;
  const fileSizeFormatted = formatBytes(fileSizeBytes);

  let isBinaryGLB = false;
  let version = '2.0';
  let triangleCount = 0;
  let vertexCount = 0;
  let meshCount = 0;
  let materialCount = 0;
  let textureCount = 0;
  let hasDracoCompression = false;
  let hasMeshoptCompression = false;
  let hasPBRMaterials = true;
  let format: 'glb' | 'gltf' | 'unknown' = 'unknown';

  // 1. File Size Validation
  if (fileSizeBytes > THRESHOLDS.MAX_FILE_SIZE_BYTES) {
    issues.push({
      type: 'error',
      code: 'FILE_SIZE_EXCEEDED',
      message: `Asset size (${fileSizeFormatted}) exceeds the 25 MB hard limit.`,
      suggestion: 'Optimize texture resolutions and compress geometry using Draco or Meshopt.',
    });
  } else if (fileSizeBytes > THRESHOLDS.WARN_FILE_SIZE_BYTES) {
    issues.push({
      type: 'warning',
      code: 'FILE_SIZE_HEAVY',
      message: `Asset size (${fileSizeFormatted}) is higher than recommended for mobile browsers (>10 MB).`,
      suggestion: 'Consider converting textures to KTX2 / WebP or compressing via gltf-transform.',
    });
  }

  // 2. Binary Header Verification
  if (buffer.byteLength >= 12) {
    const dataView = new DataView(buffer);
    const magic = dataView.getUint32(0, true); // 0x46546C67 = "glTF" in ASCII
    if (magic === 0x46546c67) {
      isBinaryGLB = true;
      format = 'glb';
      const gltfVersion = dataView.getUint32(4, true);
      version = `${gltfVersion}.0`;

      // Read JSON Chunk (Chunk 0)
      try {
        const jsonChunkLength = dataView.getUint32(12, true);
        const jsonChunkType = dataView.getUint32(16, true);

        if (jsonChunkType === 0x4e4f534a) {
          // 0x4E4F534A = "JSON"
          const jsonBytes = new Uint8Array(buffer, 20, jsonChunkLength);
          const jsonString = new TextDecoder('utf-8').decode(jsonBytes);
          const gltf = JSON.parse(jsonString);

          // Extract metrics from parsed GLTF descriptor
          meshCount = gltf.meshes?.length || 0;
          materialCount = gltf.materials?.length || 0;
          textureCount = gltf.textures?.length || gltf.images?.length || 0;

          // Check extensions
          const extensionsUsed = gltf.extensionsUsed || [];
          hasDracoCompression = extensionsUsed.includes('KHR_draco_mesh_compression');
          hasMeshoptCompression = extensionsUsed.includes('EXT_meshopt_compression');

          // Estimate triangle and vertex count from accessors
          if (gltf.accessors && gltf.meshes) {
            gltf.meshes.forEach((mesh: any) => {
              mesh.primitives?.forEach((prim: any) => {
                if (prim.indices !== undefined && gltf.accessors[prim.indices]) {
                  const count = gltf.accessors[prim.indices].count || 0;
                  triangleCount += Math.floor(count / 3);
                } else if (prim.attributes?.POSITION !== undefined) {
                  const posAcc = gltf.accessors[prim.attributes.POSITION];
                  const count = posAcc?.count || 0;
                  triangleCount += Math.floor(count / 3);
                  vertexCount += count;
                }
              });
            });
          }

          if (vertexCount === 0 && triangleCount > 0) {
            vertexCount = Math.floor(triangleCount * 1.5);
          }
        }
      } catch (err) {
        issues.push({
          type: 'warning',
          code: 'METADATA_PARSE_PARTIAL',
          message: 'Unable to parse all internal glTF JSON descriptors.',
          suggestion: 'Ensure the GLB was exported with standard glTF 2.0 schema.',
        });
      }
    } else {
      // Check if it's plaintext JSON .gltf
      try {
        const text = new TextDecoder('utf-8').decode(new Uint8Array(buffer.slice(0, 1024)));
        if (text.includes('"asset"') && text.includes('"version"')) {
          format = 'gltf';
        }
      } catch {}
    }
  }

  // Default fallback estimations if parsing was binary-only without indexed accessors
  if (triangleCount === 0 && isBinaryGLB) {
    triangleCount = Math.round((fileSizeBytes / 1024) * 8.5);
    vertexCount = Math.round(triangleCount * 1.2);
  }

  // 3. Geometry Checks
  if (triangleCount > THRESHOLDS.MAX_TRIANGLES) {
    issues.push({
      type: 'error',
      code: 'TRIANGLE_COUNT_EXCEEDED',
      message: `Polygon count (${triangleCount.toLocaleString()} triangles) exceeds the ${THRESHOLDS.MAX_TRIANGLES.toLocaleString()} budget.`,
      suggestion: 'Decimate mesh in Blender/Marvelous Designer to under 60k triangles.',
    });
  } else if (triangleCount > THRESHOLDS.WARN_TRIANGLES) {
    issues.push({
      type: 'warning',
      code: 'TRIANGLE_COUNT_HIGH',
      message: `Polygon count (${triangleCount.toLocaleString()} triangles) is high for real-time mobile rendering.`,
      suggestion: 'Optimize mesh topology to target 25k - 45k polygons for smooth 60fps.',
    });
  }

  // 4. Texture Count Checks
  if (textureCount > THRESHOLDS.MAX_TEXTURE_COUNT) {
    issues.push({
      type: 'warning',
      code: 'TEXTURE_COUNT_HIGH',
      message: `Model contains ${textureCount} separate texture maps.`,
      suggestion: 'Atlas textures into unified ORM (Occlusion, Roughness, Metallic) channels.',
    });
  }

  // 5. Compression Recommendation
  if (!hasDracoCompression && !hasMeshoptCompression && fileSizeBytes > 3 * 1024 * 1024) {
    issues.push({
      type: 'info',
      code: 'COMPRESSION_RECOMMENDED',
      message: 'Asset does not use Draco or Meshopt compression.',
      suggestion: 'Applying Draco compression typically reduces download footprint by 60-80%.',
    });
  }

  // 6. Calculate Health Score and Performance Grade
  let healthScore = 100;

  // File size deductions
  if (fileSizeBytes > THRESHOLDS.MAX_FILE_SIZE_BYTES) healthScore -= 50;
  else if (fileSizeBytes > THRESHOLDS.WARN_FILE_SIZE_BYTES) healthScore -= 25;
  else if (fileSizeBytes > THRESHOLDS.OPTIMAL_FILE_SIZE_BYTES) healthScore -= 10;

  // Geometry deductions
  if (triangleCount > THRESHOLDS.MAX_TRIANGLES) healthScore -= 40;
  else if (triangleCount > THRESHOLDS.WARN_TRIANGLES) healthScore -= 15;
  else if (triangleCount > THRESHOLDS.OPTIMAL_TRIANGLES) healthScore -= 5;

  // Compression bonus/penalty
  if (hasDracoCompression || hasMeshoptCompression) healthScore += 5;

  healthScore = Math.max(0, Math.min(100, healthScore));

  let grade: PerformanceGrade = 'A+';
  if (healthScore >= 90) grade = 'A+';
  else if (healthScore >= 80) grade = 'A';
  else if (healthScore >= 65) grade = 'B';
  else if (healthScore >= 45) grade = 'C';
  else grade = 'F';

  const hasFatalErrors = issues.some((i) => i.type === 'error');
  const isValid = !hasFatalErrors && (isBinaryGLB || format === 'gltf');

  if (!isValid && grade !== 'F') {
    grade = 'F';
    healthScore = Math.min(healthScore, 30);
  }

  let summary = 'Optimal luxury 3D asset ready for high-performance WebGL rendering.';
  if (grade === 'A') summary = 'Well-optimized 3D asset suitable for all desktop and mobile devices.';
  else if (grade === 'B') summary = 'Acceptable performance with minor optimization opportunities.';
  else if (grade === 'C') summary = 'Heavy 3D asset that may cause frame drops on lower-tier mobile hardware.';
  else if (grade === 'F') summary = 'Asset failed validation standards and requires optimization before publishing.';

  return {
    isValid,
    grade,
    healthScore,
    summary,
    metrics: {
      fileName,
      fileSizeBytes,
      fileSizeFormatted,
      format,
      isBinaryGLB,
      version,
      triangleCount,
      vertexCount,
      meshCount,
      materialCount,
      textureCount,
      hasDracoCompression,
      hasMeshoptCompression,
      hasPBRMaterials,
    },
    issues,
  };
};

/**
 * Validate a File object from user file input / dropzone
 */
export const validate3DAssetFile = async (file: File): Promise<AssetValidationResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const result = validate3DAssetBuffer(buffer, file.name);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read 3D asset file.'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate formatted text report for admin console or loggers
 */
export const formatValidationReport = (result: AssetValidationResult): string => {
  const m = result.metrics;
  return `=== VEYRA 3D ASSET VALIDATION REPORT ===
Asset: ${m.fileName} (${m.fileSizeFormatted})
Status: ${result.isValid ? 'VALID' : 'REJECTED'}
Health Grade: ${result.grade} (Score: ${result.healthScore}/100)
Triangles: ${m.triangleCount.toLocaleString()} | Vertices: ${m.vertexCount.toLocaleString()}
Format: ${m.format.toUpperCase()} (v${m.version}) | Draco: ${m.hasDracoCompression ? 'YES' : 'NO'}
Summary: ${result.summary}
Issues: ${result.issues.length === 0 ? 'None (Clean)' : result.issues.map((i) => `[${i.type.toUpperCase()}] ${i.message}`).join(', ')}
========================================`;
};
export default validate3DAssetFile;
