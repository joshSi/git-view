import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "preact/hooks";
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

  async function retrieveDirectoryContents() {
    const files: File[] = await invoke("list_files", { path: dir });
    const directories: Directory[] = await invoke("list_directories", { path: dir });
    const newContents: FileSystemObject[] = [
      ...directories.map((directory) => ({ type: FileSystemObjectType.Directory, name: directory })),
      ...files.map((file) => ({ type: FileSystemObjectType.File, name: file })),
    ];
    setContents(newContents);
  }

  function toggleDirectory() {
    !isOpen && retrieveDirectoryContents();
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    isOpen && retrieveDirectoryContents();
  }, [dir]);

  return (
    <div className="node-parent">
      <button className={`node`} onClick={toggleDirectory}>
        <div className="node-toggle">{isOpen ? '-' : '+'}</div>
        <div className="node-dir">{dir}</div>
      </button>
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

