vec4 simplex_noise_4d_permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float simplex_noise_4d_permute(float x) { return floor(mod(((x*34.0)+1.0)*x, 289.0)); }
vec4 simplex_noise_4d_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float simplex_noise_4d_taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

vec4 simplex_noise_4d_grad(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

    return p;
}

float simplex_noise_4d(vec4 v) {
    const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
    // First corner
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;

    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;

    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;

    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C 
    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

    // Permutations
    i = mod(i, 289.0); 
    float j0 = simplex_noise_4d_permute( simplex_noise_4d_permute( simplex_noise_4d_permute( simplex_noise_4d_permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = simplex_noise_4d_permute( simplex_noise_4d_permute( simplex_noise_4d_permute( simplex_noise_4d_permute (
            i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
        + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
        + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
        + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    // Gradients
    // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = simplex_noise_4d_grad(j0,   ip);
    vec4 p1 = simplex_noise_4d_grad(j1.x, ip);
    vec4 p2 = simplex_noise_4d_grad(j1.y, ip);
    vec4 p3 = simplex_noise_4d_grad(j1.z, ip);
    vec4 p4 = simplex_noise_4d_grad(j1.w, ip);

    // Normalise gradients
    vec4 norm = simplex_noise_4d_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= simplex_noise_4d_taylorInvSqrt(dot(p4,p4));

    // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return (49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
            + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) )) / 2. + .5;

}

float fractal_simplex_noise_4d(vec4 p, int iterations) {
    float total = 0.;
    float divide = 0.;

    float scale = 1.;

    for (int iter = 0; iter < 10; iter++) {
        if (iter >= iterations) {
            break;
        }
        
        total += simplex_noise_4d(p / scale) * scale;
        divide += scale;
        
        scale *= .5;
    }

    return total / divide;
}

vec4 curl_simplex_noise_4d(vec4 p) {
    const float DX = 0.01;

    float v = simplex_noise_4d(p);
    float x = simplex_noise_4d(p + vec4(DX, 0., 0., 0.));
    float y = simplex_noise_4d(p + vec4(0., DX, 0., 0.));
    float z = simplex_noise_4d(p + vec4(0., 0., DX, 0.));
    float w = simplex_noise_4d(p + vec4(0., 0., 0., DX));
    return normalize(vec4(v - x, v - y, v - x, v - w));
}

vec4 curl_fractal_simplex_noise_4d(vec4 p, int iterations) {
    const float DX = 0.01;

    float v = fractal_simplex_noise_4d(p, iterations);
    float x = fractal_simplex_noise_4d(p + vec4(DX, 0., 0., 0.), iterations);
    float y = fractal_simplex_noise_4d(p + vec4(0., DX, 0., 0.), iterations);
    float z = fractal_simplex_noise_4d(p + vec4(0., 0., DX, 0.), iterations);
    float w = fractal_simplex_noise_4d(p + vec4(0., 0., 0., DX), iterations);
    return normalize(vec4(v - x, v - y, v - x, v - w));
}