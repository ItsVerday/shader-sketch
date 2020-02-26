struct Surface {
    int id;
    float distance;

    vec3 diffuse;
    vec3 ambient;
    vec3 specular;
};

Surface create_surface(int id) {
    return Surface(id, 999999999., vec3(0., 0., 0.), vec3(0., 0., 0.), vec3(0., 0., 0.));
}

Surface compare_surfaces(Surface a, Surface b) {
    if (a.distance < b.distance) {
        return a;
    }

    return b;
}

vec3 surface_color(Surface surface, vec3 look, vec3 normal, vec3 lightDirection) {
    look = normalize(look);
    normal = normalize(normal);
    lightDirection = normalize(lightDirection);

    float cosTheta = clamp(dot(normal, lightDirection), 0., 1.);
    vec3 reflection = reflect(-lightDirection, normal);
    float cosAlpha = clamp(dot(look, reflection), 0., 1.);

    vec3 finalColor = surface.ambient;
    finalColor += surface.diffuse * cosTheta;
    finalColor += surface.specular * pow(cosAlpha, 5.);

    return finalColor;
}