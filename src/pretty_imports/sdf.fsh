@nomangle sdf_sphere_basic sdf_sphere sdf_box_basic sdf_box sdf_plane sdf_union sdf_smooth_union sdf_intersection sdf_smooth_intersection sdf_subtraction sdf_smooth_subtraction

float sdf_sphere_basic(vec3 pos) {
    return length(pos) - 1.;
}

float sdf_sphere(vec3 pos, vec3 center, float radius) {
    return sdf_sphere_basic((pos - center) / radius) * radius;
}

float sdf_box_basic(vec3 pos, vec3 scale) {
    vec3 q = abs(pos) - scale;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdf_box(vec3 pos, vec3 a, vec3 b) {
    vec3 diff = abs(a - b);
    vec3 avg = (a + b) / 2.;

    return sdf_box_basic(pos - avg, diff);
}

float sdf_plane(vec3 pos, vec4 n) {
    return dot(pos, n.xyz) + n.w;
}

float sdf_union(float d1, float d2) {
    return min(d1, d2);
}

float sdf_smooth_union(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
} 

float sdf_intersection(float d1, float d2) {
    return max(d1, d2);
}

float sdf_smooth_intersection(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) + k * h * (1.0 - h);
}

float sdf_subtraction(float d1, float d2) {
    return sdf_intersection(d1, -d2);
}

float sdf_smooth_subtraction(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d2, -d1, h) + k * h * (1.0 - h);
}