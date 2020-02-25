vec4 perlin_noise_2d_permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec2 perlin_noise_2d_fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin_noise_2d(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = perlin_noise_2d_permute(perlin_noise_2d_permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = perlin_noise_2d_fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return (2.3 * n_xy) / 2. + .5;
}

float fractal_perlin_noise_2d(vec2 p, int iterations) {
    float total = 0.;
    float divide = 0.;

    float scale = 1.;

    for (int iter = 0; iter < 10; iter++) {
        if (iter >= iterations) {
            break;
        }
        
        total += perlin_noise_2d(p / scale) * scale;
        divide += scale;
        
        scale *= .5;
    }

    return total / divide;
}

vec2 curl_perlin_noise_2d(vec2 p) {
    const float DX = 0.01;

    float v = perlin_noise_2d(p) * 2. - 1.;
    float x = perlin_noise_2d(p + vec2(DX, 0.)) * 2. - 1.;
    float y = perlin_noise_2d(p + vec2(0., DX)) * 2. - 1.;
    return normalize(vec2(v - x, v - y));
}

vec2 curl_fractal_perlin_noise_2d(vec2 p, int iterations) {
    const float DX = 0.01;

    float v = fractal_perlin_noise_2d(p, iterations) * 2. - 1.;
    float x = fractal_perlin_noise_2d(p + vec2(DX, 0.), iterations) * 2. - 1.;
    float y = fractal_perlin_noise_2d(p + vec2(0., DX), iterations) * 2. - 1.;
    return normalize(vec2(v - x, v - y));
}