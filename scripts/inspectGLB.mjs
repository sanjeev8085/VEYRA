import fs from 'fs';

const filePath = 'd:/sanjeev_tyagi/VEYRA/VEYRA_APP/public/models/garments/veyra_signature_tshirt.glb';

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);
console.log('GLB File Size:', buffer.length, 'bytes');

// Check GLTF Magic Header (0x46546C67 -> 'glTF')
const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log('Magic:', magic.toString(16), magic === 0x46546C67 ? '(Valid glTF)' : '(Invalid)');
console.log('Version:', version);
console.log('Total Header Length:', length);

// Chunk 0 is JSON
const chunk0Length = buffer.readUInt32LE(12);
const chunk0Type = buffer.readUInt32LE(16);
console.log('JSON Chunk Length:', chunk0Length, 'Type:', chunk0Type.toString(16));

if (chunk0Type === 0x4E4F534A) { // 'JSON'
  const jsonString = buffer.toString('utf8', 20, 20 + chunk0Length);
  try {
    const json = JSON.parse(jsonString);
    console.log('\n--- GLTF Scene Hierarchy & Metadata ---');
    console.log('Asset Generator/Version:', json.asset);
    console.log('Scenes:', json.scenes?.length || 0);
    console.log('Nodes:', json.nodes?.length || 0, json.nodes?.map(n => n.name || 'unnamed'));
    console.log('Meshes:', json.meshes?.length || 0, json.meshes?.map(m => m.name || 'unnamed'));
    console.log('Materials:', json.materials?.length || 0, json.materials?.map(m => m.name || 'unnamed'));
    console.log('Animations:', json.animations?.length || 0);
  } catch (e) {
    console.error('Failed to parse JSON chunk:', e);
  }
}
