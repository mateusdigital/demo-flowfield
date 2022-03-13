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
   
    set_canvas_fill  ("white");
    set_canvas_stroke("white");


    //
    // Init :)
    //

    C.MAX_PARTICLES = 100;
    G.particles     = [];

    const canvas_w = get_canvas_width ();
    const canvas_h = get_canvas_height();
    for(let i = 0; i < C.MAX_PARTICLES; ++i) {
        const x = random_int(canvas_w);
        const y = random_int(canvas_h);
        const p = make_vec2(x, y);
        G.particles.push(p);
    }


    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{
    clear_canvas();
    begin_draw();

        const canvas_w    = get_canvas_width ();
        const canvas_h    = get_canvas_height();
        const noise_scale = 0.0001;

        set_canvas_stroke("red");
        for(let i = 0; i < G.particles.length; ++i) {
            const p = G.particles[i];
            // const x = r * Math.cos((i / G.particles.length) * MATH_2PI); // p.x;
            // const y = r * Math.sin((i / G.particles.length) * MATH_2PI); // p.x;
            const n = perlin_noise(p.x * noise_scale, p.y * noise_scale);
            const a = (n * MATH_2PI);
            
            const xx = Math.cos(a) * 50;
            const yy = Math.sin(a) * 50;

            draw_point(p.x, p.y, 2);
            draw_line(p.x, p.y, p.x + xx, p.y + yy);

            p.x += (xx * dt);
            p.y += (yy * dt);
            
            if(p.x < 0 || p.x >= canvas_w || p.y < 0 || p.y > canvas_h) { 
                p.x = random_int(canvas_w);
                p.y = random_int(canvas_h);
            }

            G.particles[i] = p;
        }
    end_draw()
}
