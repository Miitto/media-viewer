import "./styles.css";
import App from "./App.svelte";
import {get, writable} from "svelte/store"
import { invoke } from "@tauri-apps/api/primitives";

export const activeIdx = writable(0);
export function setIdx(idx: any) {
  activeIdx.set(idx)
  setActive(idx)
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
  activeIdx.set(0)
  setMedia(arr)
  setActive(0)
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

export const imageExt = ["png", "jpg", "jpeg"];
export const videoExt = ["mp4", "mov", "ogg"];
export const mediaExt = imageExt.concat(videoExt);

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
