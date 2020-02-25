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
}