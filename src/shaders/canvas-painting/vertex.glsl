uniform float uEdgeStartX;
uniform float uEdgeStartY;

varying vec2 vUv;
varying float vAlpha;

void main() {
    // Calculate uvs to [-1, 1] range centered around the middle of the canvas
    // vec2 centeredUv = uv * 2.0 - 1.0;
    
    // Edge calculations
    // float elevation = smoothstep(uEdgeStartX, 1.0, abs(centeredUv.x));
    // elevation += smoothstep(uEdgeStartY, 1.0, abs(centeredUv.y));
    
    // Vertex displacement - slightly bending backward on the canvas
    // vec3 localPosition = position;
    // localPosition.z -= min(0.5, elevation) * 0.01;
    
    // Set position
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(localPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
    // Varying
    vUv = uv;
    // vAlpha = 1.0 - smoothstep(0.0, 1.0, elevation);
    vAlpha = 1.0;
}