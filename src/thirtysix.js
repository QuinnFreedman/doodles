function thirtysix(rng) {

    const header = `#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    `

    const fsSource = `
    uniform vec2 u_resolution;
    uniform vec2 u_seed;
    uniform vec3 u_color1;
    uniform vec3 u_color2;

    out vec4 fragColor;
    void main() {
        float scale = 4.5 / u_resolution.x;
        float value = 0.0;
        const int num_layers = 3;
        const float decay = 0.5;
        const float spacing = 2.0;
        float magnitude = 1.0;
        for (int i = 0; i < num_layers; i++) {
            magnitude *= decay;
            float _value = cellular(
                u_seed * vec2(5.7 * float(i) + 1.0, 5.7 * float(i) + 1.0)
                + gl_FragCoord.xy * vec2(scale, scale)).x;
            value += _value * magnitude;
            scale *= spacing;
        }
        //value = smoothstep(0.0, 1.0, value);
        //value = value * value;
        vec3 color = mix(u_color2, u_color1, value);
        float alpha = smoothstep(0.2, 0.5, value);
        /*
        float r = distance(gl_FragCoord.xy, u_resolution / 2.0) / u_resolution.x;
        alpha *= smoothstep(0.1, 0.3, r);
        */
        fragColor = vec4(color, alpha);
    }
    `

    const offscreenCanvas = document.createElement("canvas")
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 900;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    offscreenCanvas.width = CANVAS_WIDTH
    offscreenCanvas.height = CANVAS_HEIGHT

    cachedLoad("https://raw.githubusercontent.com/ashima/webgl-noise/master/src/cellular2D.glsl")
        .then(x => x.replace(/^#version\s\d+/, ""))
        .then(glslLib => {
            source =  header + glslLib + fsSource
            //console.log(source);
            const context = create2dGlContext(offscreenCanvas, source, ["seed", "color1", "color2"], "300 es");
            
            ctx.fillStyle = "#000"
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            const colors = [
                [[0, 1, 1], [0, 1, 0]],
                [[1, 0, 1], [0, 0, 1]],
                [[1, 1, 0], [1, 0, 0]],
            ]

            for (let [color1, color2] of colors) {
                draw2dGl(context, {
                    seed: [rng.nextFloat(1000), rng.nextFloat(1000)],
                    color1,
                    color2,
                })
                ctx.drawImage(offscreenCanvas, 0, 0)
            }

            let x = CANVAS_WIDTH / 2
            let y = CANVAS_HEIGHT / 2
            let r = 150 * 1.5
            let grad = ctx.createRadialGradient(x, y, r - 5, x, y, r)
            grad.addColorStop(0, "black")
            grad.addColorStop(1, "transparent")
            ctx.fillStyle = grad
            ctx.arc(x, y, r, 0, 2 * Math.PI)
            ctx.fill()
            /*
            for (let i of range(3)) {
                let r = rng.nextRange(60, 100)
                let x = rng.nextRange(r, CANVAS_WIDTH - r)
                let y = rng.nextRange(r, CANVAS_HEIGHT - r)
                
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI, false)
                let grad = ctx.createRadialGradient(x, y, r - 5, x, y, r)
                grad.addColorStop(0, "black")
                grad.addColorStop(1, "transparent")
                ctx.fillStyle = grad
                ctx.fill()
            }
            */
        })

}
