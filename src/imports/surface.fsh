struct Surface{int id;float distance;vec3 diffuse;vec3 ambient;vec3 specular;};Surface create_surface(int id){return Surface(id,999999999.,vec3(0.,0.,0.),vec3(0.,0.,0.),vec3(0.,0.,0.));}Surface compare_surfaces(Surface A,Surface B){if(A.distance<B.distance){return A;}return B;}vec3 surface_color(Surface C,vec3 D,vec3 E,vec3 F){D=normalize(D);E=normalize(E);F=normalize(F);float G=clamp(dot(E,F),0.,1.);vec3 H=reflect(-F,E);float I=clamp(dot(D,H),0.,1.);vec3 J=C.ambient;J+=C.diffuse*G;J+=C.specular*pow(I,5.);return J;}