uniform float uEdgeStartX;
uniform float uEdgeStartY;

varying vec2 vUv;
varying float vElevation;
varying float vAlpha;

void main() {
    vec3 localPosition = position;

    float adjustedX = (uv.x  - 0.5) * 2.0;
    float adjustedY = (uv.y - 0.5) * 2.0;

    float alphaX = step(uEdgeStartX, abs(adjustedX));
    float alphaY = step(uEdgeStartY, abs(adjustedY));

    //     float alphaX = step(0.9, abs(adjustedX));
    // float alphaY = step(0.9, abs(adjustedY));
    float alpha = min(alphaX, alphaY);

    // float distanceX = length(adjustedX);
    // float distanceY = length(adjustedY);

    // float edgeEnd = 1.02;


    // float alpha = smoothstep(uEdgeStartX, edgeEnd, distanceX) * pow(adjustedX, 8.0);
    // alpha += smoothstep(uEdgeStartY, edgeEnd, distanceY) * pow(adjustedY, 8.0);

    // localPosition.z += elevation * -0.01;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    // vElevation = elevation;
    vAlpha = alpha;
}