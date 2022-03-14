//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Starfield.js                                                  //
//  Project   : starfield                                                     //
//  Date      : Aug 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/source/demolib.js",
]

const C = {}; // Constants
const G = {}; // Globals


//----------------------------------------------------------------------------//
// demolib boilerplate                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_demo_mode()
{
    return new Promise((resolve, reject)=> {
        demolib_load_all_scripts(__SOURCES).then(()=> {
            canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);
            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function demo_start(user_canvas)
{
    if(!user_canvas) {
        setup_demo_mode().then((_created_canvas)=>{
            setup_common(_created_canvas);
        });
    } else {
        setup_common(user_canvas);
    }
}


//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed(null);
    set_noise_seed (null);

    set_main_canvas       (canvas);
    install_input_handlers(canvas);


    //
    // Init :)
    //

    C.MAX_PARTICLES = 100;
    
    G.min_speed            = 100;
    G.max_speed            = 200;
    G.min_size             = 1;
    G.max_size             = 1;
    G.noise_scale          = 0.001;
    G.particles            = [];
    G.draw_color           = chroma("white");
    G.clear_alpha          = 0.01;
    G.clear_color          = chroma("black").alpha(G.clear_alpha);

    const canvas_w = get_canvas_width ();
    const canvas_h = get_canvas_height();

    for(let i = 0; i < C.MAX_PARTICLES; ++i) {
        const x = random_int(canvas_w);
        const y = random_int(canvas_h);
        const p = make_vec2(x, y);
        G.particles.push(p);
    }

    set_canvas_fill("black");
    clear_canvas();

    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{

    begin_draw();

    const canvas_w  = get_canvas_width ();
    const canvas_h  = get_canvas_height();
    
    const v = Math.sin(get_total_time());
    const h = map(v, -1, 1, 0, 360);

    G.clear_alpha = map(v, -1, 1, 0.001, 0.05);
    
    G.clear_color = chroma("black").alpha(G.clear_alpha); 
    G.draw_color = chroma.hsl(h, 0.5, 0.5);
    echo(v, G.clear_alpha, h);

    clear_canvas     (G.clear_color);
    set_canvas_stroke(G.draw_color);
    set_canvas_fill  (G.draw_color);
    
    for(let i = 0; i < G.particles.length; ++i) {
        const p = G.particles[i];
    
        const noise = perlin_noise(
            p.x * G.noise_scale, 
            p.y * G.noise_scale,
            G.noise_offset
        );

        const angle = (noise * MATH_2PI);
        const speed = lerp(noise, G.min_speed, G.max_speed);
        const size  = lerp(1 - noise, G.min_size,  G.max_size);

        draw_point(p.x, p.y, size);
        
        p.x += Math.cos(angle) * speed * dt;
        p.y += Math.sin(angle) * speed * dt;
        
        if(p.x < 0 || p.x >= canvas_w || p.y < 0 || p.y > canvas_h) { 
            p.x = random_int(canvas_w);
            p.y = random_int(canvas_h);
        }

        G.particles[i] = p;
    }
    end_draw()
}
