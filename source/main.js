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
    return new Promise((resolve, reject)=>{
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
function setup_common(canvas)
{
    set_main_canvas(canvas);
    set_canvas_fill("white");

    set_random_seed       (null);
    install_input_handlers(canvas);

    // :)

    translate_canvas_to_center();
    start_draw_loop(update_demo);
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
function update_demo(dt)
{
    clear_canvas();
    begin_draw();
        // :)
    end_draw();
}
