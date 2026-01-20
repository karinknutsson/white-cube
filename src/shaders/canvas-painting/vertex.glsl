uniform float uWidth;
uniform float uHeight;

varying vec2 vUv;

void main() {
    vec3 localPosition = position;

    float adjustedX = (uv.x  - 0.5) * 2.0;
    float adjustedY = (uv.y - 0.5) * 2.0;

    float distanceX = length(adjustedX);
    float distanceY = length(adjustedY);

    float edgeStart = 0.9;
    float edgeEnd = 1.3;

    float elevation = smoothstep(edgeStart, edgeEnd, distanceX) * pow(adjustedX, 4.0);
    elevation += smoothstep(edgeStart, edgeEnd, distanceY) * pow(adjustedY, 4.0);

    localPosition.z += elevation * -0.1;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}