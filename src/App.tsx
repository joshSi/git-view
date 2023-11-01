import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/tauri";
import { Directory, DirectoryNode } from "./fileManager/DirectoryNode";

function App() {
  const [selectedDir, setSelectedDir] = useState<Directory>("");
  const [cloneUrl, setCloneUrl] = useState<string>("");

  async function chooseDirectory() {
    const result: Directory | null = await invoke("select_directory");
    if (result) {
      setSelectedDir(result);
    }
  }

  async function cloneRepository() {
    const repo = await invoke("clone_repo", {remoteUrl: cloneUrl, path: selectedDir});
  }

  return (
    <div className="container">
      <h1>File Explorer</h1>

      <button onClick={chooseDirectory}>Choose Base Directory</button>

      {selectedDir && (
        <div>
          <p>Base Directory: {selectedDir}</p>
          <DirectoryNode dir={selectedDir} />
        </div>
      )}

      <div>
        <label htmlFor="clone-url">Clone URL:</label>
        <input
          type="text"
          id="clone-url"
          value={cloneUrl}
          onChange={(e) => setCloneUrl(e.target.value)}
        />
        <button onClick={cloneRepository}>Clone Repository</button>
      </div>
    </div>
  );
}

export default App;
