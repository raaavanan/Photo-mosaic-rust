mod utils;

extern crate serde_json;
extern crate image;
extern crate color_thief;
extern crate base64;
extern crate tokio;

use tokio::prelude::*;

use wasm_bindgen::prelude::*;

use color_thief::{ColorFormat};
use image::{load_from_memory_with_format, DynamicImage};

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

#[derive(Serialize)]
pub struct Palette {
    pub color1: Vec<u8>,
    pub color2: Vec<u8>,
    pub color3: Vec<u8>,
    pub color4: Vec<u8>,
    pub color5: Vec<u8>,
}

fn find_color(t: image::ColorType) -> ColorFormat {
    match t {
        image::ColorType::RGB(8) => ColorFormat::Rgb,
        image::ColorType::RGBA(8) => ColorFormat::Rgba,
        _ => unreachable!(),
    }
}

fn load_image(image_string: String) -> DynamicImage {
    // decode the base64 image
    let decoded_img_bytes = base64::decode(&image_string).unwrap();
    
    load_from_memory_with_format(&decoded_img_bytes, image::ImageFormat::PNG).unwrap()
}

#[wasm_bindgen]
pub fn get_color_palette(image_tile: String) -> JsValue {
    // utility to log errors in JS
    utils::set_panic_hook();

    let img = load_image(String::from(image_tile));
    let color_type = find_color(img.color());
    let pixels = &img.raw_pixels();
    let colors = color_thief::get_palette(&pixels, color_type, 10, 10).unwrap();
    
    let palette = Palette {
        color1: vec![colors[0].r, colors[0].g, colors[0].b],
        color2: vec![colors[1].r, colors[1].g, colors[1].b],
        color3: vec![colors[2].r, colors[2].g, colors[2].b],
        color4: vec![colors[3].r, colors[3].g, colors[3].b],
        color5: vec![colors[4].r, colors[4].g, colors[4].b]
    };

    JsValue::from_serde(&palette).unwrap()
}

fn get_dominant_color(image_tile: String) -> Vec<u8> {
    let img = load_image(String::from(image_tile));
    let color_type = find_color(img.color());
    let pixels = &img.raw_pixels();
    let colors = color_thief::get_palette(&pixels, color_type, 10, 10).unwrap();

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
        let result_color = get_dominant_color(pixels.to_string());
        result.push(ColorCell{
            color: result_color,
            x: tile.x,
            y: tile.y
        });
    }
    JsValue::from_serde(&result).unwrap()
}

