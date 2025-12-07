import Graph from "graphology";
import Sigma from "sigma";
import * as data from "../graph.json";
import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { NodeDisplayData } from "sigma/types";

const graph = new Graph();
graph.import(data)
random.assign(graph);
forceAtlas2.assign(graph, 50)

const renderer = new Sigma(
  graph,
  document.getElementById("container") as HTMLDivElement
);
