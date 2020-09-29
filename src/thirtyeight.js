function thirtyeight(rng) {
    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 900;

    const offscreenCanvas = document.createElement("canvas")
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    offscreenCanvas.width = CANVAS_WIDTH
    offscreenCanvas.height = CANVAS_HEIGHT
    
    ctx.fillStyle = "#ccc"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillStyle = "#000"

    const NUM_POINTS = 100
    
    const voronoi = new Voronoi()

    let sites = range(NUM_POINTS).map(() => ({
        x: Math.round(rng.nextRange(CANVAS_WIDTH)),
        y: Math.round(rng.nextRange(CANVAS_HEIGHT))
    }))
    
    diagram = voronoi.compute(sites, {
        xl: 0,
        xr: CANVAS_WIDTH,
        yt: 0,
        yb: CANVAS_HEIGHT
    })

    const colors = [
        "#f00",
        "#0f0",
        "#00f",
        "#ff0",
        "#f0f",
    ]

    function drawVoronoi(diagram, colors) {
        for (let cell of diagram.cells) {
            let minDisance = Number.POSITIVE_INFINITY
            let color = rng.choice(colors)
            for (let { edge } of cell.halfedges) {
                ctx.beginPath()
                ctx.moveTo(edge.va.x, edge.va.y)
                ctx.lineTo(edge.vb.x, edge.vb.y)
                ctx.lineTo(cell.site.x, cell.site.y)
                ctx.closePath()
                ctx.fillStyle = color
                ctx.fill()
            }
        }
    }


    const fsSource = `#version 300 es
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    #define PI 3.1415926535897932384626
    const float TWO_PI = 2.0 * PI;

    mat3 makeTranslation(vec2 t) {
        return mat3(1.0, 0.0, t.x,
                    0.0, 1.0, t.y,
                    0.0, 0.0, 1.0);
    }
    
    mat3 makeRotation(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat3(c, -s,  0,
                    s,  c,  0,
                    0,  0,  1);
    }
    
    mat3 makeScale(vec2 s) {
        return mat3(s.x, 0,   0,
                    0,   s.y, 0,
                    0,   0,   1);
    }
    
    mat3 makeScale(float s) {
        return makeScale(vec2(s, s));
    }

    vec2 rotate_and_scale_in_rect(vec2 point, vec2 rect, float theta, float scale) {
        vec3 coord = vec3(point, 1.0);
        coord -= vec3(0.5, 0.5, 0.0);
        coord *= makeScale(1.0 / scale);
        coord += vec3(0.5, 0.5, 0.0);
        
        coord -= vec3(0.5, 0.5, 0.0);
        coord.x *= rect.x / rect.y;
        coord *= makeRotation(theta);
        coord.x /= rect.x / rect.y;
        coord += vec3(0.5, 0.5, 0.0);
        return coord.xy;
    }

    float remainder(float x) {
        if (x >= 0.)
            return x-floor(x);
        else
            return x-ceil(x);
    }
    
    vec2 remainder(vec2 v) {
        return vec2(remainder(v.x), remainder(v.y));
    }

    

    uniform vec2 u_resolution;
    uniform sampler2D u_image;

    const float CHROMATIC_ABORATION = 0.05;
    const float TWISTS = 2.0;
    const float SCALE = 1.0;
    const float STRETCH = 1.0;
    const bool WRAP = true;


    vec4 get_warped_tex(vec2 texCoord, float scale, float twists) {
        float theta = texCoord.y * TWO_PI * twists;
        
        vec2 coord_r = rotate_and_scale_in_rect(texCoord, u_resolution, theta, scale);
        vec2 coord_g = rotate_and_scale_in_rect(texCoord, u_resolution, theta + CHROMATIC_ABORATION, scale);
        vec2 coord_b = rotate_and_scale_in_rect(texCoord, u_resolution, theta + 2.0 * CHROMATIC_ABORATION, scale);


        if (WRAP) {
            coord_r = remainder(coord_r);
            coord_g = remainder(coord_g);
            coord_b = remainder(coord_b);

                
            return vec4(texture(u_image, coord_r.xy).r,
                        texture(u_image, coord_g.xy).g,
                        texture(u_image, coord_b.xy).b,
                        1.0);
        } else {
            vec2 coord = coord_r;
            if (coord.x >= 0.0 && coord.x <= 1.0 &&
                coord.y >= 0.0 && coord.y <= 1.0
            ) {
                return vec4(texture(u_image, coord_r.xy).r,
                            texture(u_image, coord_g.xy).g,
                            texture(u_image, coord_b.xy).b,
                            1.0);
            } else {
                return vec4(0, 0, 0, 1);
            }
        }
    }    
    
    in vec2 v_texCoord;

    out vec4 fragColor;
    void main() {
        vec2 scaledCoord = vec2(v_texCoord);
        scaledCoord -= vec2(0.5, 0.5);
        scaledCoord /= SCALE;
        scaledCoord += vec2(0.5, 0.5);
        
        fragColor = get_warped_tex(scaledCoord, STRETCH, TWISTS);
    }
    `

    const glContext = create2dGlContext(offscreenCanvas, fsSource, [], "300 es")
    drawVoronoi(diagram, colors)
    for (let i = 0; i < 3; i++) {
        draw2dGl(glContext, {}, canvas)
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.drawImage(offscreenCanvas, 0, 0)
    }

}
