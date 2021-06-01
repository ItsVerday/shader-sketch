float voronoise_2d_hash(vec2 p) {
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

vec2 voronoise_2d_hash2d(vec2 p) {
    return vec2(voronoise_2d_hash(p + vec2(0.5, 0)), voronoise_2d_hash(p + vec2(0, 0.5)));
}

// From https://www.iquilezles.org/www/articles/voronoise/voronoise.htm
float voronoise_2d(vec2 p, float u, float v) {
    vec2 p_floor = floor(p);
    vec2 f = fract(p);

    float k = 1.0 - v;
    k = k * k;
    k = k * k;
    k = 1.0 + 63.0 * k;
    float va = 0.0;
    float wt = 0.0;

    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 g = vec2(x, y);
            float value = voronoise_2d_hash(p_floor + g);
            vec2 o = voronoise_2d_hash2d(p_floor + g) * u;
            vec2 r = g - f + o;
            float d = dot(r, r);
            float w = pow(1. - smoothstep(0.0, 2., sqrt(d)), k);
            va += w * value;
            wt += w;
        }
    }

    return va / wt;
}

float fractal_voronoise_2d(vec2 p, float u, float v, int iterations) {
    float total = 0.;
    float divide = 0.;

    float scale = 1.;
    float invScale = 1.;

    for (int iter = 0; iter < 10; iter++) {
        if (iter >= iterations) {
            break;
        }
        
        total += voronoise_2d(p * invScale, u, v) * scale;
        divide += scale;
        
        scale *= .4;
        invScale *= 2.5;
    }

    return total / divide;
}

vec2 curl_voronoise_2d(vec2 p, float u, float v) {
    const float DX = 0.01;

    float val = voronoise_2d(p, u, v);
    float x = voronoise_2d(p + vec2(DX, 0.), u, v);
    float y = voronoise_2d(p + vec2(0., DX), u, v);
    return normalize(vec2(val - x, val - y));
}

vec2 curl_fractal_voronoise_2d(vec2 p, float u, float v, int iterations) {
    const float DX = 0.01;

    float val = fractal_voronoise_2d(p, u, v, iterations);
    float x = fractal_voronoise_2d(p + vec2(DX, 0.), u, v, iterations);
    float y = fractal_voronoise_2d(p + vec2(0., DX), u, v, iterations);
    return normalize(vec2(val - x, val - y));
}