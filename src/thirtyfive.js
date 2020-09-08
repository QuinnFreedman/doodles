function thirtyfive(rng) {

    const header = `#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    `

    const fsSource = `
    uniform vec2 u_resolution;
    uniform float u_seed;

    float rand(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123 + u_seed);
    }

    vec3 background(vec2 v) {
        vec3 nw = vec3(1, 0, 1);
        vec3 sw = vec3(1, 1, 0);
        vec3 se = vec3(1, 1, 1);
        vec3 ne = vec3(1, 0, 0);

        vec3 a = mix(sw, nw, v.y);
        vec3 b = mix(se, ne, v.y);
        return mix(a, b, v.x);
    }

    out vec4 fragColor;
    void main() {
        const int num_tiles = 9;
        vec2 v = gl_FragCoord.xy / u_resolution.xy;
        vec2 tile = v * float(num_tiles);
        if (int(tile.x) % 2 == 1 && int(tile.y) % 2 == 1) {
            v = vec2(1, 1) - v;
        } else {
            if (rand(v) > v.y) {
                v.y = 0.0;
            }
        }
        fragColor = vec4(background(v), 1.0);
    }
    `

    const oldCanvas = document.querySelector("canvas")
    const canvas = document.createElement("canvas")
    oldCanvas.parentNode.replaceChild(canvas, oldCanvas)

    const CANVAS_WIDTH = 700;
    const CANVAS_HEIGHT = 700;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    //cachedLoad("https://raw.githubusercontent.com/ashima/webgl-noise/master/src/noise2D.glsl")
    //fetch("https://raw.githubusercontent.com/ashima/webgl-noise/master/src/cellular2D.glsl")
        //.then(x => x.replace(/^#version\s\d+/, ""))
        //.then(glslLib => {
            //source =  header + glslLib + fsSource
        //})

    const source = header + fsSource;
    const context = create2dGlContext(canvas, source, ["seed"], "300 es");
    let seed = rng.nextFloat(100);
    draw2dGl(context, { "seed": seed })
    
    return (() => {
        canvas.parentNode.replaceChild(oldCanvas, canvas)
    })
}
