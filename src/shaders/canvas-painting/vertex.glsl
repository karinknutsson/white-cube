uniform float uWidth;
uniform float uHeight;

varying vec2 vUv;

void main() {


    vec3 localPosition = position;

    float adjustedX = (uv.x - 0.5) * 2.0;
    float adjustedY = (uv.y - 0.5) * 2.0;

    float elevation = pow(adjustedX, 2.0) + pow(adjustedY, 2.0);
    localPosition.z += elevation * 0.9;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}