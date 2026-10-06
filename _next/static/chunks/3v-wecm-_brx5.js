(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,82975,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(74080),a=e.i(75056),i=e.i(95393),n=e.i(90874),s=e.i(90072),l=e.i(61949),l=l,u=e.i(47994);let c=Math.PI/180,d=(e,t,r)=>{let o=s.MathUtils.clamp((r-e)/(t-e),0,1);return o*o*(3-2*o)},m=(e,t,r)=>new s.Vector3(r*Math.cos(e*c)*Math.cos(t*c),r*Math.sin(e*c),-r*Math.cos(e*c)*Math.sin(t*c)),h=`
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,v=`
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uLand;
uniform vec3 uSun;
uniform float uOpacity;
uniform float uCloudOffset;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float sunlight = dot(n, uSun);
  float daylight = smoothstep(-0.065, 0.20, sunlight);
  float land = texture2D(uLand, vUv).r;
  vec3 base = texture2D(uDay, vUv).rgb;
  // Blue Marble albedo plus atmospheric in-scatter above very dark open ocean.
  base += vec3(0.0012, 0.0065, 0.022) * (1.0 - land);
  float cloudShadow = smoothstep(0.14, 0.90,
    texture2D(uClouds, vec2(vUv.x + uCloudOffset + 0.0015, vUv.y - 0.0008)).r);
  float diffuse = max(sunlight, 0.0);
  vec3 color = base * (0.013 + diffuse * 1.38) * (1.0 - cloudShadow * 0.31 * daylight);
  // Water-only glint. Land is matte, rather than a metallic globe.
  vec3 halfVector = normalize(uSun + viewDirection);
  float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(n, viewDirection), 0.0), 5.0);
  float oceanGlint = pow(max(dot(n, halfVector), 0.0), 90.0);
  color += vec3(1.0, 0.94, 0.82) * oceanGlint * (0.16 + fresnel * 0.5)
    * (1.0 - land) * daylight * (1.0 - cloudShadow * 0.8);
  // Historical VIIRS 2016 composite, not live city lighting.
  float cities = texture2D(uNight, vUv).r;
  float night = 1.0 - smoothstep(-0.20, 0.045, sunlight);
  color += vec3(1.0, 0.54, 0.20) * pow(cities, 1.65) * night * 1.3;
  float rim = pow(1.0 - max(dot(n, viewDirection), 0.0), 3.8);
  float airlight = smoothstep(-0.18, 0.48, sunlight);
  color += vec3(0.018, 0.13, 0.37) * rim * airlight * 0.7;
  gl_FragColor = vec4(color, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,p=`
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uOpacity;
uniform float uCloudOffset;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec2 coord = vec2(vUv.x + uCloudOffset, vUv.y);
  float density = texture2D(uClouds, coord).r;
  float opacity = smoothstep(0.10, 0.94, density);
  float sunlight = dot(normalize(vWorldNormal), uSun);
  float day = smoothstep(-0.07, 0.20, sunlight);
  float body = max(sunlight, 0.0);
  vec3 lit = mix(vec3(0.007, 0.011, 0.022), vec3(1.0, 0.98, 0.95) * (0.13 + body * 1.15), day);
  lit += vec3(0.23, 0.055, 0.012) * exp(-abs(sunlight) * 23.0) * opacity;
  gl_FragColor = vec4(lit, opacity * uOpacity * 0.94);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,f=`
uniform vec3 uSun;
uniform float uOpacity;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float tangent = abs(dot(n, viewDirection));
  float light = smoothstep(-0.32, 0.55, dot(n, uSun));
  float density = smoothstep(0.0, 0.24, tangent);
  vec3 blue = mix(vec3(0.024, 0.085, 0.23), vec3(0.11, 0.39, 0.88), light);
  gl_FragColor = vec4(blue, density * uOpacity * (0.12 + light * 0.88));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function g({motion:e,theme:o,reducedMotion:a,embedded:y=!1}){let{size:x,gl:M,invalidate:b}=(0,n.useThree)(),[w]=(0,r.useState)(()=>x.width<760||M.capabilities.maxTextureSize<4096),[S,j,C,O]=(0,l.H)(s.TextureLoader,[(0,u.assetPath)("/textures/earth-v2/"+(w?"day-2048.webp":"day-4096.webp")),(0,u.assetPath)("/textures/earth-v2/night-2048.webp"),(0,u.assetPath)("/textures/earth-v2/clouds-2048.webp"),(0,u.assetPath)("/textures/earth-v2/land-mask-2048.webp")]),D=(0,l.H)(s.FileLoader,(0,u.assetPath)("/data/oman.geojson")),P=(0,r.useMemo)(()=>{let e=JSON.parse(String(D)),t=[];for(let r of e.features)for(let e of"MultiPolygon"===r.geometry.type?r.geometry.coordinates:[r.geometry.coordinates])for(let r of e)for(let e=1;e<r.length;e++){let o=m(r[e-1][1],r[e-1][0],2.9232),a=m(r[e][1],r[e][0],2.9232);t.push(o.x,o.y,o.z,a.x,a.y,a.z)}return new Float32Array(t)},[D]),U=(0,r.useRef)(null),W=(0,r.useRef)(null),R=(0,r.useRef)(null),E=(0,r.useRef)(null),F=(0,r.useRef)(null),z=(0,r.useRef)(null),N=(0,r.useRef)(null),T=(0,r.useRef)(null),_=(0,r.useRef)(null),A=(0,r.useMemo)(()=>m(17.0003048,54.1051167,2.9260999999999995),[]),L=(0,r.useMemo)(()=>new s.Quaternion().setFromUnitVectors(new s.Vector3(0,0,1),A.clone().normalize()),[A]),B=(0,r.useMemo)(()=>new s.Vector3(-.73,.42,.57).normalize(),[]),G=(0,r.useMemo)(()=>({uDay:{value:S},uNight:{value:j},uClouds:{value:C},uLand:{value:O},uSun:{value:B},uOpacity:{value:1},uCloudOffset:{value:0}}),[S,j,C,O,B]),k=(0,r.useMemo)(()=>({uClouds:{value:C},uSun:{value:B},uOpacity:{value:1},uCloudOffset:{value:0}}),[C,B]),V=(0,r.useMemo)(()=>({uSun:{value:B},uOpacity:{value:.62}}),[B]);return(0,r.useEffect)(()=>{for(let e of(S.colorSpace=s.SRGBColorSpace,[S,j,C,O]))e.wrapS=s.RepeatWrapping,e.anisotropy=Math.min(4,M.capabilities.getMaxAnisotropy()),e.needsUpdate=!0;b()},[S,j,C,O,M,b]),(0,i.useFrame)(()=>{if(!U.current||!W.current)return;let t=e.current.progress,r=1-d(.235,.287,t);if(U.current.visible=r>.001,!U.current.visible)return;let i=d(.125,.23,t),n=d(.23,.287,t),l=x.width<760;U.current.position.set(y||l?0:-2.55+.8*i,y?0:l?-1.65-.25*i:-.25,y?0:-(.6*i)),U.current.scale.setScalar(s.MathUtils.lerp(y?.82:l?.84:1,y?1.05:l?1.02:1.55,i)*(1+1.5*n));let u=a?1:e.current.intro;W.current.rotation.set(17.0003048*c,-(Math.PI/2+54.1051167*c)+(1-i)*(.38-.2*u),0);let m=.0015*u;N.current&&(N.current.uniforms.uOpacity.value=r,N.current.uniforms.uCloudOffset.value=m),T.current&&(T.current.uniforms.uOpacity.value=r,T.current.uniforms.uCloudOffset.value=m),_.current&&(_.current.uniforms.uOpacity.value=r*("dark"===o?.6:.34)),E.current&&(E.current.opacity=r*d(.06,.18,t)*.76),R.current&&R.current.scale.setScalar(s.MathUtils.lerp(.86,.42,i)),F.current&&(F.current.opacity=r),z.current&&(z.current.opacity=.65*r)},-10),(0,t.jsx)("group",{ref:U,name:"NASA_Blue_Marble_Earth",children:(0,t.jsxs)("group",{ref:W,children:[(0,t.jsxs)("mesh",{renderOrder:0,children:[(0,t.jsx)("sphereGeometry",{args:[2.9,w?80:128,w?48:80]}),(0,t.jsx)("shaderMaterial",{ref:N,uniforms:G,vertexShader:h,fragmentShader:v,transparent:!0,depthWrite:!0})]}),(0,t.jsxs)("mesh",{scale:1.0045,renderOrder:1,children:[(0,t.jsx)("sphereGeometry",{args:[2.9,w?64:112,w?40:64]}),(0,t.jsx)("shaderMaterial",{ref:T,uniforms:k,vertexShader:h,fragmentShader:p,transparent:!0,depthWrite:!1})]}),(0,t.jsxs)("mesh",{scale:1.023,renderOrder:2,children:[(0,t.jsx)("sphereGeometry",{args:[2.9,80,48]}),(0,t.jsx)("shaderMaterial",{ref:_,uniforms:V,vertexShader:h,fragmentShader:f,side:s.BackSide,transparent:!0,depthWrite:!1})]}),(0,t.jsxs)("lineSegments",{renderOrder:3,children:[(0,t.jsx)("bufferGeometry",{children:(0,t.jsx)("bufferAttribute",{attach:"attributes-position",args:[P,3]})}),(0,t.jsx)("lineBasicMaterial",{ref:E,color:"#f0cd89",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})]}),(0,t.jsx)("group",{position:A,quaternion:L,renderOrder:4,children:(0,t.jsxs)("group",{ref:R,children:[(0,t.jsxs)("mesh",{"position-z":.025,children:[(0,t.jsx)("sphereGeometry",{args:[.027,16,12]}),(0,t.jsx)("meshBasicMaterial",{ref:F,color:"#fff0bd",transparent:!0,toneMapped:!1})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("ringGeometry",{args:[.071,.078,48]}),(0,t.jsx)("meshBasicMaterial",{ref:z,color:"#e8c58f",transparent:!0,side:s.DoubleSide,depthWrite:!1,toneMapped:!1})]})]})})]})})}var y=e.i(43298),x=e.i(42402);class M extends r.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(e,t){this.props.onFailure?.()}render(){return this.state.failed?null:this.props.children}}function b(e){let o=(0,r.useRef)({progress:e.progress,intro:+!!e.reducedMotion,visible:!0}),a=(0,r.useRef)(!1),l=(0,r.useRef)(0),u=(0,r.useRef)(e);u.current=e,(0,r.useEffect)(()=>()=>cancelAnimationFrame(l.current),[]);let{camera:c,invalidate:d,size:m,gl:h}=(0,n.useThree)();return(0,r.useEffect)(()=>{d()},[e.progress,e.theme,e.reducedMotion,e.paused,e.embedded,m.width,m.height,d]),(0,r.useEffect)(()=>{let e=()=>{o.current.visible=!document.hidden,o.current.visible&&d()},t=e=>{e.preventDefault(),u.current.onFailure?.()};return document.addEventListener("visibilitychange",e),h.domElement.addEventListener("webglcontextlost",t),()=>{document.removeEventListener("visibilitychange",e),h.domElement.removeEventListener("webglcontextlost",t)}},[h,d]),(0,i.useFrame)((t,r)=>{if(!o.current.visible)return;let i=Math.min(r,.05),n=s.MathUtils.clamp(e.progress,0,1),h=!e.reducedMotion&&!e.paused&&e.introTime.current<4.5&&n<.12;h?e.introTime.current+=i:(n>=.12||e.reducedMotion)&&(e.introTime.current=4.5),o.current.intro=s.MathUtils.smoothstep(e.introTime.current,0,4.5),o.current.progress=e.reducedMotion||e.paused?n:s.MathUtils.damp(o.current.progress,n,6.5,i),e.embedded?(c.position.set(0,0,8.2/Math.min(1,m.width/m.height)),c.lookAt(0,0,0)):(c.position.set(0,0,m.width<760?11.2:10),c.lookAt(0,.6*(m.width<760),0)),(h||Math.abs(o.current.progress-n)>1e-4)&&d(),a.current||(a.current=!0,l.current=requestAnimationFrame(()=>u.current.onReady?.()))},-30),(0,t.jsx)(g,{motion:o,theme:e.theme,reducedMotion:e.reducedMotion,embedded:e.embedded})}e.s(["default",0,function(e){let i=1===e.activeChapter,n=(0,y.useGeographyJourney)(i,!!e.paused,e.reducedMotion),l=(0,r.useRef)(0),[u,c]=(0,r.useState)(null);(0,r.useEffect)(()=>{let t=window.matchMedia("(max-width: 900px)"),r=()=>c(t.matches&&void 0!==e.activeChapter&&e.activeChapter<2?document.getElementById(0===e.activeChapter?"earth-mobile-slot":"geography-mobile-slot"):null);return r(),t.addEventListener("change",r),()=>t.removeEventListener("change",r)},[e.activeChapter]);let d=s.MathUtils.smoothstep(n,0,.5),m=i?Math.max(e.progress,.23+.067*d):e.progress,h=(0,t.jsx)("div",{className:x.default.earthScene,"data-earth-embedded":!!u,children:(0,t.jsx)(M,{onFailure:e.onFailure,children:(0,t.jsx)(a.Canvas,{frameloop:"demand",dpr:[1,1.5],camera:{position:[0,0,10],fov:40,near:.08,far:100},gl:{alpha:!0,antialias:!0,powerPreference:"high-performance",toneMapping:s.ACESFilmicToneMapping},style:{width:"100%",height:"100%",pointerEvents:"none"},children:(0,t.jsx)(r.Suspense,{fallback:null,children:(0,t.jsx)(b,{...e,embedded:!!u,introTime:l,progress:m})})})})});return(0,t.jsxs)(t.Fragment,{children:[u?(0,o.createPortal)(h,u):h,(0,t.jsx)(y.default,{active:i,stage:n})]})}],82975)},76242,function(e){e.n(e.i(82975))}]);