import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/tauri";
import { Directory, DirectoryNode } from "./fileManager/DirectoryNode";

function App() {
  const [selectedDir, setSelectedDir] = useState<Directory>("");

  async function chooseDirectory() {
    const result: Directory | null = await invoke("select_directory");
    if (result) {
      setSelectedDir(result);
    }
  }

  return (
    <div className="container">
      <h1>File Explorer</h1>

      <button onClick={chooseDirectory}>Choose Base Directory</button>

      {selectedDir && (
        <>
          <p>Base Directory: {selectedDir}</p>
          <DirectoryNode dir={selectedDir} />
        </>
      )}
    </div>
  );
}

export default App;
