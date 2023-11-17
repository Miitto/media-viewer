<script lang="ts">
  import {
    activeIdx,
    getMedia,
    getMp4,
    mediaList,
    setActive,
    setArr,
    setIdx,
    setLoading,
    videoExt,
  } from "../main";
  import { convertFileSrc } from "@tauri-apps/api/primitives";
  import { Window } from "@tauri-apps/api/window";
  import { Plyr } from "svelte-plyr";

  var isVideo = false;
  var activeVid = "";
  var activeImg = "";
  var video: HTMLVideoElement;
  var image: HTMLImageElement;

  var media: string[] = [];
  var active = 0;
  var activeElement;
  var exten = "";

  getMedia();

  updateMedia();
  activeIdx.update((n) => n);

  mediaList.subscribe((value) => {
    media = value;
    updateMedia();
  });

  async function onKeyDown(e: KeyboardEvent, doc: Document) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goRight();
    } else if (e.key === "Escape") {
      e.preventDefault();
      await doc.exitFullscreen();
      await Window.getCurrent().setFullscreen(false);
    }
  }

  activeIdx.subscribe((value) => {
    active = value;
    updateMedia();
  });

  async function updateMedia() {
    if (media.length < 1) return;
    for (var ext of videoExt) {
      if (media[active].endsWith(`.${ext}`)) {
        if (video) {
          isVideo = true;
          exten = ext;
          activeImg = "";
          activeVid = convertFileSrc(media[active], "stream");
          video.load();
          video.play();
        }
        return;
      }
      isVideo = false;
      activeVid = "";
      activeImg = convertFileSrc(media[active], "stream");
      if (video) {
        video.pause();
      }
    }
  }

  async function fullScreenChange() {
    Window.getCurrent().setFullscreen(document.fullscreenElement !== null);
  }

  async function goLeft() {
    if (active == 0) {
      if (media[media.length - 1].toLowerCase().endsWith("avi")) {
        document.body.style.cursor = "progress";
        setLoading(active + 1);
        media[media.length - 1] = await getMp4(media[media.length - 1]);
        setLoading(-1);
        document.body.style.cursor = "default";
        setArr(media);
      }
      setIdx(media.length - 1);
    } else {
      if (media[active - 1].toLowerCase().endsWith("avi")) {
        document.body.style.cursor = "progress";
        setLoading(active + 1);
        media[active - 1] = await getMp4(media[active - 1]);
        setLoading(-1);
        document.body.style.cursor = "default";
        setArr(media);
      }
      setIdx(active - 1);
    }
    if (!isVideo && (await Window.getCurrent().isFullscreen())) {
      if (image) {
        image.requestFullscreen();
      }
    }
  }

  async function goRight() {
    if (active == media.length - 1) {
      if (media[0].toLowerCase().endsWith("avi")) {
        document.body.style.cursor = "progress";
        setLoading(active + 1);
        media[0] = await getMp4(media[0]);
        setLoading(-1);
        document.body.style.cursor = "default";
        setArr(media);
      }
      setIdx(0);
    } else {
      if (media[active + 1].toLowerCase().endsWith("avi")) {
        document.body.style.cursor = "progress";
        setLoading(active + 1);
        media[active + 1] = await getMp4(media[active + 1]);
        setLoading(-1);
        document.body.style.cursor = "default";
        setArr(media);
      }
      setIdx(active + 1);
    }
    if (!isVideo && (await Window.getCurrent().isFullscreen())) {
      if (image) {
        image.requestFullscreen();
      }
    }
  }

  let eventsToEmit = ["enterfullscreen", "exitfullscreen"];
</script>

<svelte:window on:keydown={(e) => onKeyDown(e, document)} />

<div class="center">
  <div class="parent">
    <!-- svelte-ignore a11y-media-has-caption -->
    <Plyr
      on:enterfullscreen={fullScreenChange}
      on:exitfullscreen={fullScreenChange}
      {eventsToEmit}
    >
      <video
        bind:this={video}
        class:hide={!isVideo}
        class="noselect"
        controls
        autoplay
        loop
        on:fullscreenchange={fullScreenChange}
      >
        <source src={activeVid} type={`video/${exten}`} />
        Video Not Supported
      </video>
    </Plyr>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      bind:this={image}
      src={activeImg}
      class:hide={isVideo}
      on:fullscreenchange={fullScreenChange}
    />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <p class="larr noselect" on:click={goLeft}>&larr;</p>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <p class="rarr noselect" on:click={goRight}>&rarr;</p>
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    line-height: 100%;
    max-width: 100%;
    max-height: 100%;
    position: relative;
  }

  .parent {
    display: grid;
    align-items: center;
    grid-template-rows: 1fr;
    margin-bottom: 1rem;
    overflow: hidden;
  }
  p {
    position: absolute;
    font-size: 3rem;
    top: 50%;
    margin: 0;
    padding: 4rem;
    transform: translateY(-50%);
    text-align: center;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }

  .larr {
    padding-left: 1rem;
    left: 0;
  }

  .rarr {
    padding-right: 1rem;
    right: 0;
  }

  .hide {
    display: none;
  }

  video,
  img {
    width: 100%;
    height: 100%;
    border: none;
    color: unset;
    box-shadow: none;
    padding: none;
    object-fit: contain;
    max-height: calc(100vh - 34px) !important;
    grid-row: 1;
  }
</style>
