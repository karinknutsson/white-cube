uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.a = 1.0 - pow(vElevation, 2.0);
    textureColor.a = 1.2 - vElevation * 2.0;
    gl_FragColor = textureColor;
}