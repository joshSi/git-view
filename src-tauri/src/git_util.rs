use dotenv::var;
use std::path::PathBuf;

use git2::{Cred, RepositoryState};

pub fn git_credentials_callback(
    _user: &str,
    _user_from_url: Option<&str>,
    _cred: git2::CredentialType,
) -> Result<Cred, git2::Error> {
    let user = _user_from_url.unwrap_or("git");

    if _cred.contains(git2::CredentialType::USERNAME) {
        return git2::Cred::username(user);
    }

    match var("GITVIEW_SSH_PATH") {
        Ok(key_path) => {
            println!("Authenticating with private key located in {}", key_path);
            Cred::ssh_key(user, None, PathBuf::from(&key_path).as_path(), None)
        }
        Err(_) => Err(git2::Error::from_str("Unable to retrieve private key from GITVIEW_SSH_PATH")),
    }
}

#[tauri::command]
pub fn clone_repo(remote_url: &str, path: &str) -> Result<(), String> {
    let mut callbacks = git2::RemoteCallbacks::new();
    callbacks.credentials(git_credentials_callback);

    let mut opts = git2::FetchOptions::new();
    opts.remote_callbacks(callbacks);
    opts.download_tags(git2::AutotagOption::All);

    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(opts);

    let repo_result = builder.clone(remote_url, PathBuf::from(path).as_path());

    match repo_result {
        Ok(repo) => {
            match repo.state() {
                RepositoryState::Clean => Ok(()),
                _ => Err(format!("Repository is in an unexpected state"))
            }
        },
        Err(e) => Err(format!("Failed to clone repository: {}", e)),
    }
}
