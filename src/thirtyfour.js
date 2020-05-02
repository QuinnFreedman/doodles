function thirtyfour(rng) {

    const fsSource = `
      #ifdef GL_ES
      precision mediump float;
      #endif
      
      uniform vec2 u_resolution;
      uniform vec2 u_foo;
      
      void main() {
        vec3 color1 = vec3(1.0, 0, 0);
        vec3 color2 = vec3(0, 0, 1.0);

        float color_mix = distance(u_foo, gl_FragCoord.xy / u_resolution.xy);
        vec3 color = mix(color1, color2, color_mix);

        gl_FragColor = vec4(color, 1.0);
    }`;

    
    const canvas = document.querySelector("canvas")

    const CANVAS_WIDTH = 300;
    const CANVAS_HEIGHT = 700;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT


    const context = create2dGlContext(canvas, fsSource, ["foo"]);

    let x = 0.5
    let y = 0.5
    setInterval(() => {
        x += (rng.nextFloat() - 0.5) / 40
        y += (rng.nextFloat() - 0.5) / 40
        draw2dGl(context, {"foo": [x, y]})
    }, 30)

}
