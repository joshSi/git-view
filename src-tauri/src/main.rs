// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv::dotenv;

mod file_util;
use file_util::{list_files, list_directories, select_directory};

mod git_util;
use git_util::{clone_repo};

fn main() {
  dotenv().ok();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      list_files, list_directories, select_directory, clone_repo
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
