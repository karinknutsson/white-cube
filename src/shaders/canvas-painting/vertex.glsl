uniform float uEdgeStartX;
uniform float uEdgeStartY;

varying vec2 vUv;
varying float vAlpha;

void main() {
    float adjustedX = (uv.x  - 0.5) * 2.0;
    float adjustedY = (uv.y - 0.5) * 2.0;
    float edgeEnd = 1.0;

    float distanceX = length(adjustedX);
    float distanceY = length(adjustedY);

    float alphaX = 1.0 - smoothstep(uEdgeStartX, edgeEnd, distanceX);
    float alphaY = 1.0 - smoothstep(uEdgeStartY, edgeEnd, distanceY);

    float cornerX = smoothstep(uEdgeStartX, 1.0, distanceX);
    float cornerY = smoothstep(uEdgeStartY, 1.0, distanceY);

    float cornerDistance = length(vec2(cornerX, cornerY));

    float cornerAlpha = 1.0 - smoothstep(0.0, 1.0, cornerDistance);
    cornerAlpha = pow(cornerAlpha, 0.5);

    float edgeAlpha = min(alphaX, alphaY); 
    edgeAlpha = pow(edgeAlpha, 0.5);

    float alpha = min(edgeAlpha, cornerAlpha);

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    vAlpha = alpha;
}