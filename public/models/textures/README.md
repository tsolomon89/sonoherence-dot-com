# Somaherence Texture Maps

Place PBR texture maps in this folder tree to drive the GLB material pipeline:

- `shell/`
- `water/`
- `transducers/`
- `engine/`

The runtime reads material assignments from:

- `public/models/somaherence-materials.json`

Expected map suffixes per material set:

- `*_basecolor.jpg` (sRGB)
- `*_normal.jpg` (linear)
- `*_roughness.jpg` (linear)
- `*_metallic.jpg` (linear)
- `*_ao.jpg` (linear, optional)
- `*_emissive.jpg` (sRGB, optional)

If any texture is missing, the scene falls back gracefully to procedural defaults.
