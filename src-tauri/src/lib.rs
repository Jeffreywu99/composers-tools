mod commands;
mod music;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::pitch_class_set::classify_set,
            commands::pitch_class_set::transform,
            commands::pitch_class_set::generate_random,
            commands::pitch_class_set::get_forte_table,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
