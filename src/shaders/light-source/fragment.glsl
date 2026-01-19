varying vec2 vUv;

void main() {
    float strength = 1.0 - distance(vUv, vec2(0.5));
    vec3 color = vec3(3.0, 3.0, 2.8);

    gl_FragColor = vec4(color, strength);
}