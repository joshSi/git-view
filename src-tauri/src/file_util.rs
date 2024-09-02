use std::fs;

#[tauri::command]
pub fn list_files(path: &str) -> Vec<String> {
  let mut files = Vec::new();
  if let Ok(entries) = fs::read_dir(path) {
    for entry in entries {
      if let Ok(entry) = entry {
        if let Ok(metadata) = entry.metadata() {
          if metadata.is_file() {
            if let Some(filename) = entry.path().file_name() {
              if let Some(filename_str) = filename.to_str() {
                files.push(filename_str.to_string());
              }
            }
          }
        }
      }
    }
  }
  files
}

#[tauri::command]
pub fn list_directories(path: &str) -> Vec<String> {
  let mut directories = Vec::new();
  if let Ok(entries) = fs::read_dir(path) {
    for entry in entries {
      if let Ok(entry) = entry {
        if let Ok(metadata) = entry.metadata() {
          if metadata.is_dir() {
            if let Some(directory_name) = entry.path().file_name() {
              if let Some(directory_name_str) = directory_name.to_str() {
                directories.push(directory_name_str.to_string());
              }
            }
          }
        }
      }
    }
  }
  directories
}

use std::path::PathBuf;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
pub async fn select_directory() -> Result<String, String> {
  let dialog_result: Option<PathBuf> = FileDialogBuilder::new().pick_folder();

	match dialog_result {
    Some(path) => {
      match path.to_str() {
        Some(str_path) => Ok(str_path.to_owned()),
        None => Err("Path is not valid UTF-8".to_string()),
      }
    },
    None => Err("User canceled the folder selection".to_string()),
  }
}
