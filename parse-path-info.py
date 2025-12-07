import argparse
import json

MAX_SIZE = 40

def load_graph(filename):
    with open(args.graph_data_file, "r") as f:
        return json.loads(f.read())

def serialize_node(node, name, maximum):
    return {
        "key": name,
        "attributes": {
            "label": name,
            "size": MAX_SIZE / maximum * node["closureSize"],
            "closureSize": node["closureSize"],
            "narHash": node["narHash"],
            "narSize": node["narSize"],
        },
    }

def serialize_graph(graph):
    serialized = {
        "nodes": list(),
        "edges": list(),
    }

    maximum = 0
    for name, node in graph.items():
        maximum = max(maximum, node["closureSize"])

    for name, node in graph.items():
        serialized["nodes"].append(serialize_node(node, name, maximum))

        for referenced_node in node["references"]:
            serialized["edges"].append({
                "source": name,
                "target": referenced_node,
            })

    return serialized

def main(args):
    graph = load_graph(args.graph_data_file)
    serialized = serialize_graph(graph)
    print(json.dumps(serialized))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("graph_data_file")
    args = parser.parse_args() 

    main(args)
