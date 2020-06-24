float voronoise_3d_hash(vec3 p) {
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x - p.z)) * sin(12.0 * p.z - sin(p.x * 10.0))));
}

vec3 voronoise_3d_hash3d(vec3 p) {
    return vec3(voronoise_3d_hash(p + vec3(0.5, 0, 0)), voronoise_3d_hash(p + vec3(0, 0.5, 0)), voronoise_3d_hash(p + vec3(0, 0, 0.5)));
}

// From https://www.iquilezles.org/www/articles/voronoise/voronoise.htm and https://www.shadertoy.com/view/4ljGzW
float voronoise_3d(vec3 p, float u, float v) {
    vec3 p_floor = floor(p);
    vec3 f = fract(p);

    float k = 1.0 - v;
    k = k * k;
    k = k * k;
    k = 1.0 + 31.0 * k;
    float va = 0.0;
    float wt = 0.0;

    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            for (int z = -2; z <= 2; z++) {
                vec3 g = vec3(x, y, z);
                float value = voronoise_3d_hash(p_floor + g);
                vec3 o = voronoise_3d_hash3d(p_floor + g) * u;
                vec3 r = g - f + o;
                float d = dot(r, r);
                float w = pow(1. - smoothstep(0.0, 2., sqrt(d)), k);
                va += w * value;
                wt += w;
            }
        }
    }

    return va / wt;
}

float fractal_voronoise_3d(vec3 p, float u, float v, int iterations) {
    float total = 0.;
    float divide = 0.;

    float scale = 1.;
    float invScale = 1.;

    for (int iter = 0; iter < 10; iter++) {
        if (iter >= iterations) {
            break;
        }
        
        total += voronoise_3d(p * invScale, u, v) * scale;
        divide += scale;
        
        scale *= .4;
        invScale *= 2.5;
    }

    return total / divide;
}

vec3 curl_voronoise_3d(vec3 p, float u, float v) {
    const float DX = 0.01;

    float val = voronoise_3d(p, u, v);
    float x = voronoise_3d(p + vec3(DX, 0., 0.), u, v);
    float y = voronoise_3d(p + vec3(0., DX, 0.), u, v);
    float z = voronoise_3d(p + vec3(0., 0., DX), u, v);
    return normalize(vec3(val - x, val - y, val - x));
}

vec3 curl_fractal_voronoise_3d(vec3 p, float u, float v, int iterations) {
    const float DX = 0.01;

    float val = fractal_voronoise_3d(p, u, v, iterations);
    float x = fractal_voronoise_3d(p + vec3(DX, 0., 0.), u, v, iterations);
    float y = fractal_voronoise_3d(p + vec3(0., DX, 0.), u, v, iterations);
    float z = fractal_voronoise_3d(p + vec3(0., 0., DX), u, v, iterations);
    return normalize(vec3(val - x, val - y, val - z));
}