<script lang="ts">
  import { open } from "@tauri-apps/plugin-dialog";
  import { readDir } from "@tauri-apps/plugin-fs";
  import {
    mediaList,
    setArr,
    mediaExt,
    imageExt,
    videoExt,
    parseAvi,
  } from "../main";

  async function openFile() {
    var files = await open({
      multiple: true,
      filters: [
        {
          name: "Media",
          extensions: mediaExt,
        },
        {
          name: "Images",
          extensions: imageExt,
        },
        {
          name: "Video",
          extensions: videoExt,
        },
        {
          name: "All",
          extensions: ["*"],
        },
      ],
    });

    if (files === null) return;
    setArr(files as any);
  }

  async function openFolder() {
    var folders: any = await open({
      directory: true,
      multiple: true,
    })!;

    if (folders === null) return;
    var fileList: string[] = [];
    folders.forEach((el: string) => {
      readDir(el)
        .then((files) => {
          files.forEach((file) => {
            if (file.children != null) return;

            for (var ext of mediaExt) {
              if (file.name?.toLowerCase().endsWith(`.${ext}`)) {
                fileList.push(file.path);
                break;
              }
            }
          });
        })
        .then(() => {
          //parseAvi(fileList as any);
          setArr(fileList);
        });
    });
  }
</script>

<nav>
  <div class="dropdown">
    <p>File</p>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="dropdown-content">
      <p on:click={openFile}>Open</p>
      <p on:click={openFolder}>Open Folder</p>
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    flex: 0 0 1rem;
    margin: 0;
    padding: 0;
    background-color: #2f2f2f;

    p {
      padding: 5px 10px;
      margin: 0;
      width: max-content;
      text-align: center;
      width: 100%;
      height: 100%;
    }

    .dropdown {
      position: relative;
      display: inline-block;
      min-width: max-content;
      &:hover {
        background-color: #353535;
      }
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
      display: none;
      position: absolute;
      min-width: max-content;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 2;
      background-color: #2f2f2f;
      p {
        background-color: #2f2f2f;
      }
      p:hover {
        background-color: #3f3f3f;
      }
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }
  }
</style>
