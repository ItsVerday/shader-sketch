vec4 perlin_noise_3d_permute(vec4 A){return mod(((A*34.)+1.)*A,289.);}vec4 perlin_noise_3d_taylorInvSqrt(vec4 B){return 1.79284291400159-0.85373472095314*B;}vec3 perlin_noise_3d_fade(vec3 C){return C*C*C*(C*(C*6.-15.)+10.);}float perlin_noise_3d(vec3 D){vec3 E=floor(D);vec3 F=E+vec3(1.);E=mod(E,289.);F=mod(F,289.);vec3 G=fract(D);vec3 H=G-vec3(1.);vec4 I=vec4(E.x,F.x,E.x,F.x);vec4 J=vec4(E.yy,F.yy);vec4 K=E.zzzz;vec4 L=F.zzzz;vec4 M=perlin_noise_3d_permute(perlin_noise_3d_permute(I)+J);vec4 N=perlin_noise_3d_permute(M+K);vec4 O=perlin_noise_3d_permute(M+L);vec4 P=N/7.;vec4 Q=fract(floor(P)/7.)-0.5;P=fract(P);vec4 R=vec4(0.5)-abs(P)-abs(Q);vec4 S=step(R,vec4(0.));P-=S*(step(0.,P)-0.5);Q-=S*(step(0.,Q)-0.5);vec4 T=O/7.;vec4 U=fract(floor(T)/7.)-0.5;T=fract(T);vec4 V=vec4(0.5)-abs(T)-abs(U);vec4 W=step(V,vec4(0.));T-=W*(step(0.,T)-0.5);U-=W*(step(0.,U)-0.5);vec3 X=vec3(P.x,Q.x,R.x);vec3 Y=vec3(P.y,Q.y,R.y);vec3 Z=vec3(P.z,Q.z,R.z);vec3 a=vec3(P.w,Q.w,R.w);vec3 b=vec3(T.x,U.x,V.x);vec3 c=vec3(T.y,U.y,V.y);vec3 d=vec3(T.z,U.z,V.z);vec3 e=vec3(T.w,U.w,V.w);vec4 f=perlin_noise_3d_taylorInvSqrt(vec4(dot(X,X),dot(Z,Z),dot(Y,Y),dot(a,a)));X*=f.x;Z*=f.y;Y*=f.z;a*=f.w;vec4 g=perlin_noise_3d_taylorInvSqrt(vec4(dot(b,b),dot(d,d),dot(c,c),dot(e,e)));b*=g.x;d*=g.y;c*=g.z;e*=g.w;float h=dot(X,G);float i=dot(Y,vec3(H.x,G.yz));float j=dot(Z,vec3(G.x,H.y,G.z));float k=dot(a,vec3(H.xy,G.z));float l=dot(b,vec3(G.xy,H.z));float m=dot(c,vec3(H.x,G.y,H.z));float n=dot(d,vec3(G.x,H.yz));float o=dot(e,H);vec3 p=perlin_noise_3d_fade(G);vec4 q=mix(vec4(h,i,j,k),vec4(l,m,n,o),p.z);vec2 r=mix(q.xy,q.zw,p.y);float s=mix(r.x,r.y,p.x);return(2.2*s)/2.+.5;}float fractal_perlin_noise_3d(vec3 t,int u){float v=0.;float w=0.;float x=1.;for(int y=0;y<10;y++){if(y>=u){break;}v+=perlin_noise_3d(t/x)*x;w+=x;x*=.5;}return v/w;}vec3 curl_perlin_noise_3d(vec3 t){const float z=0.01;float AA=perlin_noise_3d(t);float A=perlin_noise_3d(t+vec3(z,0.,0.));float AB=perlin_noise_3d(t+vec3(0.,z,0.));float AC=perlin_noise_3d(t+vec3(0.,0.,z));return normalize(vec3(AA-A,AA-AB,AA-A));}vec3 curl_fractal_perlin_noise_3d(vec3 t,int u){const float z=0.01;float AA=fractal_perlin_noise_3d(t,u);float A=fractal_perlin_noise_3d(t+vec3(z,0.,0.),u);float AB=fractal_perlin_noise_3d(t+vec3(0.,z,0.),u);float AC=fractal_perlin_noise_3d(t+vec3(0.,0.,z),u);return normalize(vec3(AA-A,AA-AB,AA-AC));}