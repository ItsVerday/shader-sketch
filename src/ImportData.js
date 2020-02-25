// NOISE FUNCTIONS FROM https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// COLOR FUNCTIONS FROM https://gist.github.com/yiwenl/745bfea7f04c456e0101 AND https://www.shadertoy.com/view/XljGzV

export default {
    __global__: `
const float PI = 3.1415926535897932384626433832795;
`,
    perlin_noise_2d: `
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
const float DX = 0.1;

float v = perlin_noise_2d(p) * 2. - 1.;
float x = perlin_noise_2d(p + vec2(DX, 0.)) * 2. - 1.;
float y = perlin_noise_2d(p + vec2(0., DX)) * 2. - 1.;
return normalize(vec2(v - x, v - y));
}

vec2 curl_fractal_perlin_noise_2d(vec2 p, int iterations) {
const float DX = 0.1;

float v = fractal_perlin_noise_2d(p, iterations) * 2. - 1.;
float x = fractal_perlin_noise_2d(p + vec2(DX, 0.), iterations) * 2. - 1.;
float y = fractal_perlin_noise_2d(p + vec2(0., DX), iterations) * 2. - 1.;
return normalize(vec2(v - x, v - y));
}`,
    perlin_noise_3d: `
vec4 perlin_noise_3d_permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 perlin_noise_3d_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 perlin_noise_3d_fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin_noise_3d(vec3 P){
vec3 Pi0 = floor(P); // Integer part for indexing
vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
Pi0 = mod(Pi0, 289.0);
Pi1 = mod(Pi1, 289.0);
vec3 Pf0 = fract(P); // Fractional part for interpolation
vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
vec4 iy = vec4(Pi0.yy, Pi1.yy);
vec4 iz0 = Pi0.zzzz;
vec4 iz1 = Pi1.zzzz;

vec4 ixy = perlin_noise_3d_permute(perlin_noise_3d_permute(ix) + iy);
vec4 ixy0 = perlin_noise_3d_permute(ixy + iz0);
vec4 ixy1 = perlin_noise_3d_permute(ixy + iz1);

vec4 gx0 = ixy0 / 7.0;
vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
gx0 = fract(gx0);
vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
vec4 sz0 = step(gz0, vec4(0.0));
gx0 -= sz0 * (step(0.0, gx0) - 0.5);
gy0 -= sz0 * (step(0.0, gy0) - 0.5);

vec4 gx1 = ixy1 / 7.0;
vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
gx1 = fract(gx1);
vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
vec4 sz1 = step(gz1, vec4(0.0));
gx1 -= sz1 * (step(0.0, gx1) - 0.5);
gy1 -= sz1 * (step(0.0, gy1) - 0.5);

vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

vec4 norm0 = perlin_noise_3d_taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
g000 *= norm0.x;
g010 *= norm0.y;
g100 *= norm0.z;
g110 *= norm0.w;
vec4 norm1 = perlin_noise_3d_taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
g001 *= norm1.x;
g011 *= norm1.y;
g101 *= norm1.z;
g111 *= norm1.w;

float n000 = dot(g000, Pf0);
float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
float n111 = dot(g111, Pf1);

vec3 fade_xyz = perlin_noise_3d_fade(Pf0);
vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
return (2.2 * n_xyz) / 2. + .5;
}

float fractal_perlin_noise_3d(vec3 p, int iterations) {
float total = 0.;
float divide = 0.;

float scale = 1.;

for (int iter = 0; iter < 10; iter++) {
    if (iter >= iterations) {
        break;
    }
    
    total += perlin_noise_3d(p / scale) * scale;
    divide += scale;
    
    scale *= .5;
}

return total / divide;
}

vec3 curl_perlin_noise_3d(vec3 p) {
const float DX = 0.1;

float v = perlin_noise_3d(p) * 2. - 1.;
float x = perlin_noise_3d(p + vec3(DX, 0., 0.)) * 2. - 1.;
float y = perlin_noise_3d(p + vec3(0., DX, 0.)) * 2. - 1.;
float z = perlin_noise_3d(p + vec3(0., 0., DX)) * 2. - 1.;
return normalize(vec3(v - x, v - y, v - x));
}

vec3 curl_fractal_perlin_noise_3d(vec3 p, int iterations) {
const float DX = 0.1;

float v = fractal_perlin_noise_3d(p, iterations) * 2. - 1.;
float x = fractal_perlin_noise_3d(p + vec3(DX, 0., 0.), iterations) * 2. - 1.;
float y = fractal_perlin_noise_3d(p + vec3(0., DX, 0.), iterations) * 2. - 1.;
float z = fractal_perlin_noise_3d(p + vec3(0., 0., DX), iterations) * 2. - 1.;
return normalize(vec3(v - x, v - y, v - z));
}`,
    perlin_noise_4d: `
vec4 perlin_noise_4d_permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 perlin_noise_4d_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 perlin_noise_4d_fade(vec4 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin_noise_4d(vec4 P) {
vec4 Pi0 = floor(P); // Integer part for indexing
vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
Pi0 = mod(Pi0, 289.0);
Pi1 = mod(Pi1, 289.0);
vec4 Pf0 = fract(P); // Fractional part for interpolation
vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
vec4 iy = vec4(Pi0.yy, Pi1.yy);
vec4 iz0 = vec4(Pi0.zzzz);
vec4 iz1 = vec4(Pi1.zzzz);
vec4 iw0 = vec4(Pi0.wwww);
vec4 iw1 = vec4(Pi1.wwww);

vec4 ixy = perlin_noise_4d_permute(perlin_noise_4d_permute(ix) + iy);
vec4 ixy0 = perlin_noise_4d_permute(ixy + iz0);
vec4 ixy1 = perlin_noise_4d_permute(ixy + iz1);
vec4 ixy00 = perlin_noise_4d_permute(ixy0 + iw0);
vec4 ixy01 = perlin_noise_4d_permute(ixy0 + iw1);
vec4 ixy10 = perlin_noise_4d_permute(ixy1 + iw0);
vec4 ixy11 = perlin_noise_4d_permute(ixy1 + iw1);

vec4 gx00 = ixy00 / 7.0;
vec4 gy00 = floor(gx00) / 7.0;
vec4 gz00 = floor(gy00) / 6.0;
gx00 = fract(gx00) - 0.5;
gy00 = fract(gy00) - 0.5;
gz00 = fract(gz00) - 0.5;
vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
vec4 sw00 = step(gw00, vec4(0.0));
gx00 -= sw00 * (step(0.0, gx00) - 0.5);
gy00 -= sw00 * (step(0.0, gy00) - 0.5);

vec4 gx01 = ixy01 / 7.0;
vec4 gy01 = floor(gx01) / 7.0;
vec4 gz01 = floor(gy01) / 6.0;
gx01 = fract(gx01) - 0.5;
gy01 = fract(gy01) - 0.5;
gz01 = fract(gz01) - 0.5;
vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
vec4 sw01 = step(gw01, vec4(0.0));
gx01 -= sw01 * (step(0.0, gx01) - 0.5);
gy01 -= sw01 * (step(0.0, gy01) - 0.5);

vec4 gx10 = ixy10 / 7.0;
vec4 gy10 = floor(gx10) / 7.0;
vec4 gz10 = floor(gy10) / 6.0;
gx10 = fract(gx10) - 0.5;
gy10 = fract(gy10) - 0.5;
gz10 = fract(gz10) - 0.5;
vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
vec4 sw10 = step(gw10, vec4(0.0));
gx10 -= sw10 * (step(0.0, gx10) - 0.5);
gy10 -= sw10 * (step(0.0, gy10) - 0.5);

vec4 gx11 = ixy11 / 7.0;
vec4 gy11 = floor(gx11) / 7.0;
vec4 gz11 = floor(gy11) / 6.0;
gx11 = fract(gx11) - 0.5;
gy11 = fract(gy11) - 0.5;
gz11 = fract(gz11) - 0.5;
vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
vec4 sw11 = step(gw11, vec4(0.0));
gx11 -= sw11 * (step(0.0, gx11) - 0.5);
gy11 -= sw11 * (step(0.0, gy11) - 0.5);

vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

vec4 norm00 = perlin_noise_4d_taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
g0000 *= norm00.x;
g0100 *= norm00.y;
g1000 *= norm00.z;
g1100 *= norm00.w;

vec4 norm01 = perlin_noise_4d_taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
g0001 *= norm01.x;
g0101 *= norm01.y;
g1001 *= norm01.z;
g1101 *= norm01.w;

vec4 norm10 = perlin_noise_4d_taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
g0010 *= norm10.x;
g0110 *= norm10.y;
g1010 *= norm10.z;
g1110 *= norm10.w;

vec4 norm11 = perlin_noise_4d_taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
g0011 *= norm11.x;
g0111 *= norm11.y;
g1011 *= norm11.z;
g1111 *= norm11.w;

float n0000 = dot(g0000, Pf0);
float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
float n1111 = dot(g1111, Pf1);

vec4 fade_xyzw = perlin_noise_4d_fade(Pf0);
vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
return (2.2 * n_xyzw) / 2. + .5;
}

float fractal_perlin_noise_4d(vec4 p, int iterations) {
float total = 0.;
float divide = 0.;

float scale = 1.;

for (int iter = 0; iter < 10; iter++) {
    if (iter >= iterations) {
        break;
    }
    
    total += perlin_noise_4d(p / scale) * scale;
    divide += scale;
    
    scale *= .5;
}

return total / divide;
}

vec4 curl_perlin_noise_4d(vec4 p) {
const float DX = 0.1;

float v = perlin_noise_4d(p) * 2. - 1.;
float x = perlin_noise_4d(p + vec4(DX, 0., 0., 0.)) * 2. - 1.;
float y = perlin_noise_4d(p + vec4(0., DX, 0., 0.)) * 2. - 1.;
float z = perlin_noise_4d(p + vec4(0., 0., DX, 0.)) * 2. - 1.;
float w = perlin_noise_4d(p + vec4(0., 0., 0., DX)) * 2. - 1.;
return normalize(vec4(v - x, v - y, v - x, v - w));
}

vec4 curl_fractal_perlin_noise_4d(vec4 p, int iterations) {
const float DX = 0.1;

float v = fractal_perlin_noise_4d(p, iterations) * 2. - 1.;
float x = fractal_perlin_noise_4d(p + vec4(DX, 0., 0., 0.), iterations) * 2. - 1.;
float y = fractal_perlin_noise_4d(p + vec4(0., DX, 0., 0.), iterations) * 2. - 1.;
float z = fractal_perlin_noise_4d(p + vec4(0., 0., DX, 0.), iterations) * 2. - 1.;
float w = fractal_perlin_noise_4d(p + vec4(0., 0., 0., DX), iterations) * 2. - 1.;
return normalize(vec4(v - x, v - y, v - x, v - w));
}`,
    perlin_noise: [ "perlin_noise_2d", "perlin_noise_3d", "perlin_noise_4d" ],
    simplex_noise_2d: `
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
const float DX = 0.1;

float v = simplex_noise_2d(p) * 2. - 1.;
float x = simplex_noise_2d(p + vec2(DX, 0.)) * 2. - 1.;
float y = simplex_noise_2d(p + vec2(0., DX)) * 2. - 1.;
return normalize(vec2(v - x, v - y));
}

vec2 curl_fractal_simplex_noise_2d(vec2 p, int iterations) {
const float DX = 0.1;

float v = fractal_simplex_noise_2d(p, iterations) * 2. - 1.;
float x = fractal_simplex_noise_2d(p + vec2(DX, 0.), iterations) * 2. - 1.;
float y = fractal_simplex_noise_2d(p + vec2(0., DX), iterations) * 2. - 1.;
return normalize(vec2(v - x, v - y));
}`,
    simplex_noise_3d: `
vec4 simplex_noise_3d_permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 simplex_noise_3d_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float simplex_noise_3d(vec3 v) { 
const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
vec3 i  = floor(v + dot(v, C.yyy) );
vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );

//  x0 = x0 - 0. + 0.0 * C 
vec3 x1 = x0 - i1 + 1.0 * C.xxx;
vec3 x2 = x0 - i2 + 2.0 * C.xxx;
vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
i = mod(i, 289.0 ); 
vec4 p = simplex_noise_3d_permute( simplex_noise_3d_permute( simplex_noise_3d_permute( 
         i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
       + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
       + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
float n_ = 1.0/7.0; // N=7
vec3  ns = n_ * D.wyz - D.xzx;

vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );

vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
vec4 norm = simplex_noise_3d_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return (42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                            dot(p2,x2), dot(p3,x3) ) )) / 2. + .5;
}

float fractal_simplex_noise_3d(vec3 p, int iterations) {
float total = 0.;
float divide = 0.;

float scale = 1.;

for (int iter = 0; iter < 10; iter++) {
    if (iter >= iterations) {
        break;
    }
    
    total += simplex_noise_3d(p / scale) * scale;
    divide += scale;
    
    scale *= .5;
}

return total / divide;
}

vec3 curl_simplex_noise_3d(vec3 p) {
const float DX = 0.1;

float v = simplex_noise_3d(p) * 2. - 1.;
float x = simplex_noise_3d(p + vec3(DX, 0., 0.)) * 2. - 1.;
float y = simplex_noise_3d(p + vec3(0., DX, 0.)) * 2. - 1.;
float z = simplex_noise_3d(p + vec3(0., 0., DX)) * 2. - 1.;
return normalize(vec3(v - x, v - y, v - x));
}

vec3 curl_fractal_simplex_noise_3d(vec3 p, int iterations) {
const float DX = 0.1;

float v = fractal_simplex_noise_3d(p, iterations) * 2. - 1.;
float x = fractal_simplex_noise_3d(p + vec3(DX, 0., 0.), iterations) * 2. - 1.;
float y = fractal_simplex_noise_3d(p + vec3(0., DX, 0.), iterations) * 2. - 1.;
float z = fractal_simplex_noise_3d(p + vec3(0., 0., DX), iterations) * 2. - 1.;
return normalize(vec3(v - x, v - y, v - z));
}`,
    simplex_noise_4d: `
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
const float DX = 0.1;

float v = simplex_noise_4d(p) * 2. - 1.;
float x = simplex_noise_4d(p + vec4(DX, 0., 0., 0.)) * 2. - 1.;
float y = simplex_noise_4d(p + vec4(0., DX, 0., 0.)) * 2. - 1.;
float z = simplex_noise_4d(p + vec4(0., 0., DX, 0.)) * 2. - 1.;
float w = simplex_noise_4d(p + vec4(0., 0., 0., DX)) * 2. - 1.;
return normalize(vec4(v - x, v - y, v - x, v - w));
}

vec4 curl_fractal_simplex_noise_4d(vec4 p, int iterations) {
const float DX = 0.1;

float v = fractal_simplex_noise_4d(p, iterations) * 2. - 1.;
float x = fractal_simplex_noise_4d(p + vec4(DX, 0., 0., 0.), iterations) * 2. - 1.;
float y = fractal_simplex_noise_4d(p + vec4(0., DX, 0., 0.), iterations) * 2. - 1.;
float z = fractal_simplex_noise_4d(p + vec4(0., 0., DX, 0.), iterations) * 2. - 1.;
float w = fractal_simplex_noise_4d(p + vec4(0., 0., 0., DX), iterations) * 2. - 1.;
return normalize(vec4(v - x, v - y, v - x, v - w));
}`,
    simplex_noise: [ "simplex_noise_2d", "simplex_noise_3d", "simplex_noise_4d" ],
    noise: [ "perlin_noise", "simplex_noise" ],
    color: `
vec3 RGBtoHSV(vec3 rgb) {
 float Cmax = max(rgb.r, max(rgb.g, rgb.b));
 float Cmin = min(rgb.r, min(rgb.g, rgb.b));
 float delta = Cmax - Cmin;

 vec3 hsv = vec3(0., 0., Cmax);

 if (Cmax > Cmin) {
     hsv.y = delta / Cmax;

     if (rgb.r == Cmax)
         hsv.x = (rgb.g - rgb.b) / delta;
     else {
         if (rgb.g == Cmax)
             hsv.x = 2. + (rgb.b - rgb.r) / delta;
         else
             hsv.x = 4. + (rgb.r - rgb.g) / delta;
     }
     hsv.x = fract(hsv.x / 6.);
 }
 return hsv;
}

vec3 HSVtoRGB(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 RGBtoHSL(vec3 color) {
 vec3 hsl; // init to 0 to avoid warnings ? (and reverse if + remove first part)

 float fmin = min(min(color.r, color.g), color.b); //Min. value of RGB
 float fmax = max(max(color.r, color.g), color.b); //Max. value of RGB
 float delta = fmax - fmin; //Delta RGB value

 hsl.z = (fmax + fmin) / 2.0; // Luminance

 if (delta == 0.0) //This is a gray, no chroma...
 {
     hsl.x = 0.0; // Hue
     hsl.y = 0.0; // Saturation
 } else //Chromatic data...
 {
     if (hsl.z < 0.5)
         hsl.y = delta / (fmax + fmin); // Saturation
     else
         hsl.y = delta / (2.0 - fmax - fmin); // Saturation

     float deltaR = (((fmax - color.r) / 6.0) + (delta / 2.0)) / delta;
     float deltaG = (((fmax - color.g) / 6.0) + (delta / 2.0)) / delta;
     float deltaB = (((fmax - color.b) / 6.0) + (delta / 2.0)) / delta;

     if (color.r == fmax)
         hsl.x = deltaB - deltaG; // Hue
     else if (color.g == fmax)
         hsl.x = (1.0 / 3.0) + deltaR - deltaB; // Hue
     else if (color.b == fmax)
         hsl.x = (2.0 / 3.0) + deltaG - deltaR; // Hue

     if (hsl.x < 0.0)
         hsl.x += 1.0; // Hue
     else if (hsl.x > 1.0)
         hsl.x -= 1.0; // Hue
 }

 return hsl;
}

vec3 HSLtoRGB(vec3 c) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}`,
    sdf: `
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
}`,
    __raymarch: `
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
`,
    camera: `
vec3 camera_look(float yaw, float pitch, float fov, float aspectRatio, vec2 screenPos) {
    screenPos = screenPos * 2. - 1.;
    pitch = pitch * PI / 180.;
    yaw = yaw * PI / 180.;

    vec3 forward = vec3(cos(yaw) * cos(pitch), sin(pitch), sin(yaw) * cos(pitch));
    vec3 up = vec3(cos(yaw) * cos(pitch + PI / 2.), sin(pitch + PI / 2.), sin(yaw) * cos(pitch + PI / 2.));
    vec3 right = cross(forward, up);

    screenPos.y /= aspectRatio;
    float fovScale = tan(fov * PI / 180.);

    up *= fovScale;
    right *= fovScale;

    return normalize(forward + right * screenPos.x + up * screenPos.y);
}
`,
    raymarch: [ "sdf", "__raymarch" ]
};