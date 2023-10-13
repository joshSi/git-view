import { invoke } from "@tauri-apps/api";
import { useState } from "preact/hooks";
import "./DirectoryNode.css";

export type File = string;
export type Directory = string;
enum FileSystemObjectType {
  File,
  Directory,
}

interface FileSystemObject {
  type: FileSystemObjectType;
  name: string;
}

interface FileNodeProps {
  filename: File;
}

interface DirectoryNodeProps {
  dir: Directory;
}

export function FileNode({ filename }: FileNodeProps) {
  return (<div className="node">{filename}</div>);
}

export function DirectoryNode({ dir }: DirectoryNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState<FileSystemObject[]>([]);

  async function toggleDirectory() {
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Fetch directory contents only if opening
      const files: File[] = await invoke("list_files", { path: dir });
      const directories: Directory[] = await invoke("list_directories", { path: dir });
      const newContents: FileSystemObject[] = [
        ...files.map((file) => ({ type: FileSystemObjectType.File, name: file })),
        ...directories.map((directory) => ({ type: FileSystemObjectType.Directory, name: directory })),
      ];
      setContents(newContents);
    }
  }

  return (
    <div className="node-parent">
      <div className="node" onClick={toggleDirectory}>
        <div className="node-toggle">{isOpen ? '-' : '+'}</div>
        <div className="node-dir">{dir}</div>
      </div>
      {isOpen && (
        <ul>
          {contents.map((obj) => (
            <li key={obj.name}>
              {
              obj.type === FileSystemObjectType.File ? <FileNode filename={obj.name} /> : <DirectoryNode dir={`${dir}/${obj.name}`} />
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
