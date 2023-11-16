<script lang="ts">
  import Title from "./lib/Title.svelte";
  import Tree from "./lib/Tree.svelte";
  import Media from "./lib/Media.svelte";

  import resize from "./resize";
</script>

<main>
  <Title />
  <section class="shide-grabber">
    <div class="tree" use:resize={["right"]}>
      <Tree />
    </div>
    <Media />
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    background-color: #252525;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  section {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1 1 0;
  }

  .tree {
    overflow: hidden;
    background-color: #2a2a2a;
    flex: 0 0 auto;
    width: min-content;
    min-width: 50px;
    position: relative;
    height: 100%;
    white-space: nowrap;
  }

  :global(.grabber) {
    position: absolute;
    box-sizing: border-box;
    background: #353535;
  }

  :global(.grabber.right) {
    width: 10px;
    height: 100%;
    right: -5px;
    cursor: col-resize;
    top: 0;
  }

  :global(.grabber.left) {
    width: 10px;
    height: 100%;
    left: -5px;
    cursor: col-resize;
  }

  :global(.grabber.top) {
    height: 10px;
    width: 100%;
    top: -5px;
    cursor: row-resize;
  }

  :global(.grabber.bottom) {
    height: 10px;
    width: 100%;
    bottom: -5px;
    cursor: row-resize;
  }

  :global(.grabber.top-left) {
    height: 20px;
    width: 20px;
    top: -10px;
    left: -10px;
    cursor: nw-resize;
    border-radius: 100%;
  }

  :global(.grabber.top-right) {
    height: 20px;
    width: 20px;
    top: -10px;
    right: -10px;
    cursor: ne-resize;
    border-radius: 100%;
  }

  :global(.grabber.bottom-left) {
    height: 20px;
    width: 20px;
    bottom: -10px;
    left: -10px;
    cursor: sw-resize;
    border-radius: 100%;
  }

  :global(.grabber.bottom-right) {
    height: 20px;
    width: 20px;
    bottom: -10px;
    right: -10px;
    cursor: se-resize;
    border-radius: 100%;
  }

  :global(.hide-grabber .grabber) {
    background: transparent !important;
    border: none !important;
  }

  :global(.grabber.selected) {
    border: solid 1px #3f3f3f;
  }
</style>
