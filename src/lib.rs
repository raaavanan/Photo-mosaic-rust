mod utils;

extern crate serde_json;
extern crate image;
extern crate color_thief;
extern crate base64;

use wasm_bindgen::prelude::*;

use color_thief::{ColorFormat};
use image::{load_from_memory_with_format};

#[macro_use]
extern crate serde_derive;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[derive(Serialize, Deserialize)]
pub struct InputCell {
    pub pixels: String,
    pub x: i32,
    pub y: i32
}


#[derive(Serialize)]
pub struct ColorCell {
    pub color: Vec<u8>,
    pub x: i32,
    pub y: i32
}

fn find_color(t: image::ColorType) -> ColorFormat {
    match t {
        image::ColorType::RGB(8) => ColorFormat::Rgb,
        image::ColorType::RGBA(8) => ColorFormat::Rgba,
        _ => unreachable!(),
    }
}

#[wasm_bindgen]
pub fn image_data(image_tile: String) -> Vec<u8> {
    // utility to log errors in JS
    utils::set_panic_hook();

    // decode the base64 image
    let decoded_img_bytes = base64::decode(&image_tile).unwrap();
    let img = load_from_memory_with_format(&decoded_img_bytes, image::ImageFormat::PNG).unwrap();
    let color_type = find_color(img.color());
    let pixels = &img.raw_pixels();
    let colors = color_thief::get_palette(&pixels, color_type, 1, 2).unwrap();
    
    //pixels.to_vec()
    vec![colors[0].r, colors[0].g, colors[0].b]
}

#[wasm_bindgen]
pub fn mosaify(tiles: &JsValue) -> JsValue {
    // utility to log errors in JS
    utils::set_panic_hook();

    let image_tiles: Vec<InputCell> = tiles.into_serde().unwrap();
    let mut result: Vec<ColorCell> = Vec::new();

    for tile in image_tiles.iter() {
        let pixels = &tile.pixels;
        let result_tile = image_data(pixels.to_string());
        result.push(ColorCell{
            color: result_tile,
            x: tile.x,
            y: tile.y
        });
    }
    


    JsValue::from_serde(&result).unwrap()
}

