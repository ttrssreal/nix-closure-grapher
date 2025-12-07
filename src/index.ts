import Graph from "graphology";
import Sigma from "sigma";
import DataTable, { ConfigColumns } from 'datatables.net-dt';
import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { NodeDisplayData } from "sigma/types";
import FA2Layout from "graphology-layout-forceatlas2/worker";

const graphElement: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
const uploadElement: HTMLInputElement = document.getElementById("upload") as HTMLInputElement;
const liveUpdateGraphCheckboxElement: HTMLInputElement = document.getElementById("live-update-graph") as HTMLInputElement;
let graph: Graph | null = null;
let renderer: Sigma | null = null;
let selectedNode: string | null = null;
let isDragging: boolean = false;
let draggedNode: string | null = null;
let fa2LayoutWorker: FA2Layout | null = null;

function setNodeHighlight(state: boolean) {
  if (graph === null)
    return

  if (selectedNode === null)
    return

  graph.setNodeAttribute(selectedNode, "highlighted", state);
}

const table = new DataTable("#infoTable", {
  searching: false,
  paging: false,
  info: false,
  columns: [
    {
      name: "key",
    },
    {
      name: "value",
    },
  ]
});

uploadElement.addEventListener("change", event => {
  const target: HTMLInputElement = event.target as HTMLInputElement;

  if (target.files?.length !== 1) {
    alert("Please select only one json file");
  }

  const file = target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    const graphData = JSON.parse(reader.result?.toString() || "");
    graph = new Graph();

    graph.import(graphData)
    random.assign(graph);
    forceAtlas2.assign(graph, 50);

    let settings = forceAtlas2.inferSettings(graph);
    settings.slowDown = 500;
    settings.gravity = 0.05;

    fa2LayoutWorker = new FA2Layout(graph, {
      settings: settings,
    });

    if (renderer)
      renderer.kill()

    renderer = setupRenderer(graph);
  };

  reader.onerror = () => {
    alert("Error reading the file. Please try again.");
  };

  reader.readAsText(file);
});

liveUpdateGraphCheckboxElement.addEventListener("click", event => {
  const target: HTMLInputElement = event.target as HTMLInputElement;

  if (!fa2LayoutWorker)
    return

  if (target.checked)
    fa2LayoutWorker.start();
  else
    fa2LayoutWorker.start();
});

function setupRenderer(graph: Graph) {
  const renderer = new Sigma(graph, graphElement);

  renderer.on("clickNode", event => {
    setNodeHighlight(false);

    selectedNode = event.node;
    setNodeHighlight(true);

    table.clear();

    const attributes = graph.getNodeAttributes(selectedNode);
    table.rows.add(Object.entries(attributes));

    table.draw();
  });

  renderer.on("clickStage", event => {
    setNodeHighlight(false);

    selectedNode = null;
  });

  renderer.on("downNode", event => {
    isDragging = true;
    draggedNode = event.node;

    fa2LayoutWorker.stop();

    // Disable the camera while dragging
    if (!renderer.getCustomBBox())
      renderer.setCustomBBox(renderer.getBBox());
  });

  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode)
      return;

    const pos = renderer.viewportToGraph(event);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
  });

  function handleUp() {
    if (draggedNode)
      graph.removeNodeAttribute(draggedNode, "highlighted");

    if (fa2LayoutWorker && liveUpdateGraphCheckboxElement.checked)
      fa2LayoutWorker.start();

    isDragging = false;
    draggedNode = null;
  };

  renderer.on("upNode", handleUp);
  renderer.on("upStage", handleUp);

  return renderer;
}
