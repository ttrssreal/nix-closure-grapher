import argparse
import json
import humanize

MAX_NODE_SIZE = 40
MIN_NODE_SIZE = 1

def load_graph(filename):
    with open(args.graph_data_file, "r") as f:
        return json.loads(f.read())

def serialize_node(node, name, maximum, size_key):
    return {
        "key": name,
        "attributes": {
            "label": name,
            "size": max(MAX_NODE_SIZE / maximum * node[size_key], MIN_NODE_SIZE),
            "closureSize": humanize.naturalsize(node["closureSize"]),
            "narHash": node["narHash"],
            "narSize": humanize.naturalsize(node["narSize"]),
        },
    }

def serialize_graph(graph, size_key):
    serialized = {
        "nodes": list(),
        "edges": list(),
    }

    maximum = 0
    for name, node in graph.items():
        maximum = max(maximum, node[size_key])

    for name, node in graph.items():
        serialized["nodes"].append(serialize_node(node, name, maximum, size_key))

        for referenced_node in node["references"]:
            serialized["edges"].append({
                "source": name,
                "target": referenced_node,
            })

    return serialized

def main(args):
    graph = load_graph(args.graph_data_file)
    serialized = serialize_graph(graph, args.size_key)
    print(json.dumps(serialized))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("graph_data_file")
    parser.add_argument("-k", "--size-key", help="closureSize or narSize", required=True)

    args = parser.parse_args() 

    main(args)
