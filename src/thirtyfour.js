function thirtyfour(rng) {

    const precision = `#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    `

    const fsSource = `
    uniform vec2 u_resolution;
    uniform vec2 u_seed;

    //uniform vec3 u_colors[4];

    float map(float x, float a) {
        return (exp2(x*a) - 1.0) / (exp2(a) - 1.0);
    }

    vec3 get_color(float x) {
        const int num_colors = 15;
        vec3 colors[num_colors];
        colors[0] = vec3(207.0 / 255.0, 145.0 / 255.0, 194.0 / 255.0);
        colors[1] = vec3(145.0 / 255.0, 207.0 / 255.0, 152.0 / 255.0);
        colors[2] = vec3(152.0 / 255.0, 145.0 / 255.0, 207.0 / 255.0);
        colors[3] = vec3(207.0 / 255.0, 202.0 / 255.0, 145.0 / 255.0);
        colors[4] = vec3(103.0 / 255.0, 120.0 / 255.0, 181.0 / 255.0);

        for (int i = 5; i < num_colors; i++) {
            colors[i] = colors[i % 5];
        }
        
        x = (x + 1.0) / 2.0;
        x *= float(num_colors);
        for (int i = 0; i < num_colors; i++) {
            if (x < float(i + 1)) {
                return colors[i];
            }
        }
    }

    out vec4 fragColor;
    void main() {
        float scale = 1.0 / u_resolution.x;
        float value = 0.0;
        const int num_layers = 4;
        const float decay = 0.5;
        const float spacing = 2.0;
        float magnitude = 1.0;
        for (int i = 0; i < num_layers; i++) {
            magnitude *= decay;
            float _value = snoise(
                u_seed * vec2(5.7 * float(i) + 1.0, 5.7 * float(i) + 1.0)
                + gl_FragCoord.xy * vec2(scale, scale));
            value += _value * magnitude;
            scale *= spacing;
        }
        //gl_FragColor = vec4(get_color(value), 1.0);
        fragColor = vec4(get_color(value), 1.0);
    }
    `

    const oldCanvas = document.querySelector("canvas")
    const canvas = document.createElement("canvas")
    oldCanvas.parentNode.replaceChild(canvas, oldCanvas)

    const CANVAS_WIDTH = 300;
    const CANVAS_HEIGHT = 700;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    fetch("https://raw.githubusercontent.com/ashima/webgl-noise/master/src/noise2D.glsl")
    //fetch("https://raw.githubusercontent.com/ashima/webgl-noise/master/src/cellular2D.glsl")
        .then(x => x.text())
        .then(x => x.replace(/^#version\s\d+/, ""))
        .then(glslLib => {
            source =  precision + glslLib + fsSource
            //console.log(source);
            const context = create2dGlContext(canvas, source, ["seed"], "300 es");

            let x = rng.nextFloat(100);
            let y = rng.nextFloat(100);
            draw2dGl(context, { "seed": [x, y] })
        })

    return (() => {
        canvas.parentNode.replaceChild(oldCanvas, canvas)
    })
}
