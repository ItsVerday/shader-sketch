vec3 camera_look(float yaw, float pitch, float fov, float aspectRatio, vec2 screenPos) {
    screenPos = screenPos * 2. - 1.;
    pitch = pitch * PI / 180.;
    yaw = yaw * PI / 180.;

    fov /= 2.;

    vec3 forward = vec3(cos(yaw) * cos(pitch), sin(pitch), sin(yaw) * cos(pitch));
    vec3 up = vec3(cos(yaw) * cos(pitch + PI / 2.), sin(pitch + PI / 2.), sin(yaw) * cos(pitch + PI / 2.));
    vec3 right = cross(forward, up);

    screenPos.y /= aspectRatio;
    float fovScale = tan(fov * PI / 180.);

    up *= fovScale;
    right *= fovScale;

    return normalize(forward + right * screenPos.x + up * screenPos.y);
}