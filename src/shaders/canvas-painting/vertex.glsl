uniform float uEdgeStartX;
uniform float uEdgeStartY;

varying vec2 vUv;
varying float vAlpha;

void main() {
    vec3 localPosition = position;

    float adjustedX = (uv.x  - 0.5) * 2.0;
    float adjustedY = (uv.y - 0.5) * 2.0;

    float distanceX = length(adjustedX);
    float distanceY = length(adjustedY);

    float edgeEnd = 1.0;

    float elevation = smoothstep(uEdgeStartX, edgeEnd, distanceX);
    elevation += smoothstep(uEdgeStartY, edgeEnd, distanceY);

    elevation = min(0.5, elevation);
    localPosition.z += elevation * -0.01;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    float alpha = 1.0 - smoothstep(0.0, 0.5, elevation);

    vUv = uv;
    vAlpha = alpha;
}