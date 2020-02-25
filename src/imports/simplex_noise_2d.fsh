vec3 simplex_noise_2d_permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplex_noise_2d(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = simplex_noise_2d_permute( simplex_noise_2d_permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return (130.0 * dot(m, g)) / 2. + .5;
}

float fractal_simplex_noise_2d(vec2 p, int iterations) {
    float total = 0.;
    float divide = 0.;

    float scale = 1.;

    for (int iter = 0; iter < 10; iter++) {
        if (iter >= iterations) {
            break;
        }
        
        total += simplex_noise_2d(p / scale) * scale;
        divide += scale;
        
        scale *= .5;
    }

    return total / divide;
}

vec2 curl_simplex_noise_2d(vec2 p) {
    const float DX = 0.01;

    float v = simplex_noise_2d(p) * 2. - 1.;
    float x = simplex_noise_2d(p + vec2(DX, 0.)) * 2. - 1.;
    float y = simplex_noise_2d(p + vec2(0., DX)) * 2. - 1.;
    return normalize(vec2(v - x, v - y));
}

vec2 curl_fractal_simplex_noise_2d(vec2 p, int iterations) {
    const float DX = 0.01;

    float v = fractal_simplex_noise_2d(p, iterations) * 2. - 1.;
    float x = fractal_simplex_noise_2d(p + vec2(DX, 0.), iterations) * 2. - 1.;
    float y = fractal_simplex_noise_2d(p + vec2(0., DX), iterations) * 2. - 1.;
    return normalize(vec2(v - x, v - y));
}