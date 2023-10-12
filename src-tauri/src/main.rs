// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_util;
use file_util::{list_files, list_directories, select_directory};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_files, list_directories, select_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
