<script lang="ts">
  import { TauriEvent, listen } from "@tauri-apps/api/event";
  import {
    mediaList,
    activeIdx,
    setIdx,
    getName,
    setMedia,
    setArr,
  } from "../main";

  let items: string[] = [];

  mediaList.subscribe((value: string[]) => {
    items = value;
  });

  let active: number = 0;
  activeIdx.subscribe((value: number) => {
    active = value;
  });

  async function setActive(idx: number) {
    setIdx(idx);
  }

  listen("tauri://file-drop", (event: any) => {
    var curLen = items.length;
    var newPaths: Set<string> = new Set();
    for (var path of event.payload.paths) {
      if (!items.includes(path)) {
        newPaths.add(path);
      }
    }
    if (newPaths.size > 0) {
      setArr(items.concat([...newPaths] as any));
      setIdx(curLen);
    }
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#each items as i, idx}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <p class:active={idx == active} on:click={() => setActive(idx)}>
    {getName(i)}
  </p>
{/each}

<style lang="scss">
  p {
    font-size: 0.9rem;
    padding: 0.4rem 10px 0.4rem 5px;
    margin: 0;

    &:hover {
      background-color: #353535;
    }

    &.active {
      background-color: #202020;
    }
  }
</style>
