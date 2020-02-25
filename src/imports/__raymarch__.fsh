struct RayMarch {
    int iterations;
    int maxIterations;
    vec3 position;
    vec3 direction;
    float epsilon;
    bool finished;
    bool hit;
    float smallestDistance;
    vec3 closestPosition;
    float emission;
};

RayMarch create_raymarch(vec3 position, vec3 direction, int maxIterations) {
    return RayMarch(0, maxIterations, position, direction, 0.0001, false, false, 999999999., vec3(0., 0., 0.), 0.);
}

RayMarch iterate_raymarch(RayMarch rayMarch, float sdf) {
    rayMarch.iterations++;

    if (sdf < rayMarch.epsilon) {
        rayMarch.finished = true;
        rayMarch.hit = true;
        return rayMarch;
    }

    if (rayMarch.iterations > rayMarch.maxIterations) {
        rayMarch.finished = true;
        return rayMarch;
    }

    rayMarch.position += normalize(rayMarch.direction) * sdf;
    float emission = 1. / (sdf + 1.);

    if (rayMarch.emission < emission) {
        rayMarch.emission = emission;
    }

    if (sdf < rayMarch.smallestDistance) {
        rayMarch.smallestDistance = sdf;
        rayMarch.closestPosition = rayMarch.position;
    }
    
    return rayMarch;
}

vec3 raymarch_normal(float center, float x, float y, float z) {
    return normalize(vec3(center - x, center - y, center - z));
}

float raymarch_ambient_occlusion(RayMarch rayMarch, float intensity) {
    return pow(1. - intensity, float(rayMarch.iterations));
}

float raymarch_emission(RayMarch rayMarch, float limit, float intensity) {
    return limit * intensity * (2. / (1. + exp(-rayMarch.emission / limit)) - 1.);
}