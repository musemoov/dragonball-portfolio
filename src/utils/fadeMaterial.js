const replaceFragmentShader = (fragmentShader) =>
  fragmentShader
    .replace(
      `#include <common>`,
      `#include <common>
      float exponentialEasing(float x, float a) {
        float epsilon = 0.00001;
        float min_param_a = 0.0 + epsilon;
        float max_param_a = 1.0 - epsilon;
        a = max(min_param_a, min(max_param_a, a));
        if (a < 0.5) return pow(x, 2.0 * a);
        else return pow(x, 1.0 / (1.0 - (2.0 * (a - 0.5))));
      }`
    )
    // ✅ 핵심 중 핵심 - 전역 삭제
    .replace(/#include <colorspace_fragment>/g, '')
    .replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      float fadeDist = 350.0;
      float dist = length(vViewPosition);
      float fadeOpacity = smoothstep(fadeDist, 0.0, dist);
      fadeOpacity = exponentialEasing(fadeOpacity, 0.93);
      vec4 diffuseColor = vec4( diffuse, fadeOpacity * opacity );
      `
    );

export const fadeOnBeforeCompile = (shader) => {
  console.log(shader.fragmentShader);
  shader.fragmentShader = replaceFragmentShader(shader.fragmentShader);
};

export const fadeOnBeforeCompileFlat = (shader) => {
  shader.fragmentShader = replaceFragmentShader(shader.fragmentShader)
    .replace(/#include <output_fragment>/g, `gl_FragColor = diffuseColor;`);
};
