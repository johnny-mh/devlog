#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

uniform float u_dark;

const float pi = 3.1415926535;

float randf(int counter) {
  return fract(sin(float(counter)) * 43.7585453);
}

vec2 randf2(int counter) {
  float phi = randf(counter) * 2. * pi;

  return vec2(cos(phi), sin(phi));
}

vec3 randf3(int counter) {
  float phi = randf(counter) * 2. * pi;
  float cos_theta = 2. * randf(counter * 2) - 1.;
  float sin_theta = sqrt(1. - cos_theta * cos_theta);
  return vec3(cos(phi) * sin_theta, sin(phi) * sin_theta, cos_theta);
}

float g(float t) {
  return t * t * (3. - 2. * t);
}

float squareSize;

float perlinNoise(vec3 P) {
  vec3 p = P / squareSize;
  ivec3 i = ivec3(floor(p));
  vec3 r = fract(p);

  const int iL = 10;
  const int iS = iL * iL;
  int i00 = i.x + iL * i.y + iS * i.z;

  float f000 = dot(r - vec3(0., 0., 0.), randf3(i00));
  float f001 = dot(r - vec3(1., 0., 0.), randf3(i00 + 1));
  float f010 = dot(r - vec3(0., 1., 0.), randf3(i00 + iL));
  float f011 = dot(r - vec3(1., 1., 0.), randf3(i00 + iL + 1));
  float f100 = dot(r - vec3(0., 0., 1.), randf3(i00 + iS));
  float f101 = dot(r - vec3(1., 0., 1.), randf3(i00 + iS + 1));
  float f110 = dot(r - vec3(0., 1., 1.), randf3(i00 + iS + iL));
  float f111 = dot(r - vec3(1., 1., 1.), randf3(i00 + iS + iL + 1));
  float f00 = f000 + (f001 - f000) * g(r.x);
  float f01 = f010 + (f011 - f010) * g(r.x);
  float f10 = f100 + (f101 - f100) * g(r.x);
  float f11 = f110 + (f111 - f110) * g(r.x);
  float f0 = f00 + (f01 - f00) * g(r.y);
  float f1 = f10 + (f11 - f10) * g(r.y);

  return f0 + (f1 - f0) * g(r.z) + 0.5;
}

float bell(float x, float s) {
  return exp2(-x * x * s);
}

void main() {
  squareSize = min(u_resolution.x, u_resolution.y) * 0.3;
  float t = u_time * squareSize;
  vec3 p = vec3(gl_FragCoord.xy, 0.02 * t);
  float f = perlinNoise(p);

  vec2 dF = vec2(dFdx(f), dFdy(f));
  const float lineWidth = 0.5;
  float s = 0.72134752 / (dot(dF, dF) * lineWidth * lineWidth);

  float c = 0.;
  c += 0.2 * bell(f - 0.1, s);
  c += 0.4 * bell(f - 0.2, s);
  c += 0.5 * bell(f - 0.3, s);
  c += 0.6 * bell(f - 0.4, s);
  c += 0.8 * bell(f - 0.5, s);
  c += 0.6 * bell(f - 0.6, s);
  c += 0.5 * bell(f - 0.7, s);
  c += 0.4 * bell(f - 0.8, s);
  c += 0.2 * bell(f - 0.9, s);

  p.z = t * 0.2 + 100.;
  float I = perlinNoise(p) + 0.1;

  if (u_dark < 1.0) {
    I = I * 0.75;
  } else {
    I = I * 0.85;
  }

  c *= (I * I) * (I * I);

  vec4 result = vec4(vec3(0.0) + vec3(c), 1.);

  if (u_dark < 1.0) {
    result.xyz = vec3(1.) - result.xyz;
  }

  gl_FragColor = result;
}
