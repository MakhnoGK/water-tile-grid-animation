uniform sampler2D image;
uniform sampler2D image2;
uniform float time;
uniform float mouseOver;
uniform float intensity;
uniform float strength;
uniform float area;
uniform float waveSpeed;
varying vec2 vUv;

#define NUM_OCTAVES 5

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main(void) {
    vec2 uv = vUv;
    
    vec2 surface = strength * vec2(
        mix(-0.1, 0.2, fbm(5.*uv + waveSpeed * time)),
        mix(-0.1, 0.2, fbm(5.*uv + waveSpeed * time))
    );

    uv += mouseOver * intensity * refract(
        vec2(0, 0), 
        surface, 
        1.0 / 1.333
    );

    vec3 _texture = texture2D(image, uv).rgb;
    gl_FragColor = vec4(_texture,1.0);            
} 