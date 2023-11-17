<script lang="ts">
  import { TauriEvent, listen } from "@tauri-apps/api/event";
  import {
    mediaList,
    activeIdx,
    setIdx,
    getName,
    setMedia,
    setArr,
    getMp4,
    setLoading,
    loadingIdx,
  } from "../main";

  let items: string[] = [];

  mediaList.subscribe((value: string[]) => {
    items = value;
  });

  let active: number = 0;
  activeIdx.subscribe((value: number) => {
    active = value;
  });

  let loading: number = 0;
  loadingIdx.subscribe((value: number) => {
    loading = value;
  });

  async function setActive(idx: number) {
    if (items[idx].toLowerCase().endsWith("avi")) {
      document.body.style.cursor = "progress";
      setLoading(idx);
      items[idx] = await getMp4(items[idx]);
      setLoading(-1);
      document.body.style.cursor = "default";
      setArr(items);
    }
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
  <p
    class:active={idx == active}
    class:loading={idx == loading}
    on:click={() => setActive(idx)}
  >
    {getName(i)}
  </p>
{/each}

<style lang="scss">
  @keyframes fade {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  p {
    font-size: 0.9rem;
    padding: 0.4rem calc(1rem + 5px) 0.4rem 1rem;
    margin: 0;

    &:hover {
      background-color: #353535;
    }

    &.active {
      background-color: #202020;
    }

    &.loading {
      position: relative;
      background-image: linear-gradient(#353535, #222);
      z-index: 6;
      &:before {
        background-image: linear-gradient(#222, #353535);
        animation: 3s ease-in-out infinite fade;
        content: "";
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        z-index: -1000;
      }
    }
  }
</style>
