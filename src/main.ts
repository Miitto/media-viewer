import "./styles.css";
import App from "./App.svelte";
import {get, writable} from "svelte/store"
import { convertFileSrc, invoke } from "@tauri-apps/api/primitives";
import { Command } from "@tauri-apps/plugin-shell"
import { createDir, exists } from "@tauri-apps/plugin-fs"

export const activeIdx = writable(0);
export function setIdx(idx: any) {
  activeIdx.set(idx)
  setActive(idx)
}

export const loadingIdx = writable(-1);
export function setLoading(idx: any) {
  loadingIdx.set(idx)
}

document.addEventListener("keydown", (e) => {
  console.log(e.key)
})

export function getName(name: string) {
  return name.substring(name.lastIndexOf("\\") + 1);
}

export const mediaList = writable([]);
export function setArr(arr: string[]) {
  arr.sort((a, b) => {
    a = getName(a)
    b = getName(b)
    var a1 = parseInt(a)
    var b1 = parseInt(b)
    if (!Number.isNaN(a1) && !Number.isNaN(b1)) return (a1 - b1);
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        var r = a.charCodeAt(i)! - b.charCodeAt(j)!
        if (r != 0) {
          return -r
        } 
      }
    }
    return 0
  })
  mediaList.set(arr as any)
  
  setMedia(arr)
  var act = get(activeIdx)
  if (act > arr.length - 1) {
    activeIdx.set(0)
  }
}


export async function getMedia() {
  var med: string[] = await invoke("get_media");
  mediaList.set(med as any);
}

export async function getActive() {
  var med: string[] = await invoke("get_active");
  activeIdx.set(med as any);
}

export async function setMedia(media: any) {
  await invoke("set_media", {set: media});
}

export async function setActive(active: any) {
  await invoke("set_active", {set: active});
}

await getMedia();
await getActive();

export async function parseAvi(files: string[]) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].toLowerCase().endsWith(".avi")) {
      files[i] = await getMp4(files[i])
      setArr(files);
    }
  }
  console.log(files)
}

export async function getMp4(file: string) {
  var format = "mp4"
  var base = file.substring(0, file.lastIndexOf("\\"))
  if (!await exists(`${base}\\${format}`)) {
    await createDir(`${base}\\${format}`)
  }
  var name = file.substring(file.lastIndexOf("\\"), file.length - 4)
  const cmd = Command.sidecar("bin/ffmpeg", [
    "-n",
    "-i",
    `${file}`,
    "-c:v",
    "h264",
    `${base}\\${format}${name}.${format}`,
  ])
  const output = await cmd.execute()
  setLoading(-1);
  if (output.code == 0) {
    return `${base}\\${format}${name}.${format}`;
  }
  return file;
}

export const imageExt = ["png", "jpg", "jpeg"];
export const videoExt = ["mp4", "mov", "ogg", "avi"];
export const mediaExt = imageExt.concat(videoExt);

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
