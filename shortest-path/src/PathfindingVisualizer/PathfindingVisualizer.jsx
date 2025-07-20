import React, { Component } from "react";
import Node from "./Node/Node";
import dijkstra, { getNodesInShortestPathOrder } from "../Algorithm/Dijkstra";
import { bfs } from "../Algorithm/Bfs";
import { getNodesInShortestPathOrder1 } from "../Algorithm/Bfs";


import "./PathfindingVisualizer.css";

const NUM_ROWS = 20;
const NUM_COLS = 40;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            isRunning: false,
            mouseIsPressed: false,
            startNode: null,
            endNode: null,
            mode: "start",
        };
    }

    componentDidMount() {
        const grid = this.createInitialGrid();
        this.setState({ grid });
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    createInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < NUM_COLS; col++) {
                currentRow.push(this.createNode(row, col));
            }
            grid.push(currentRow);
        }
        return grid;
    };

    createNode = (row, col) => ({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
    });

    resetGrid = () => {
        const newGrid = this.createInitialGrid();
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const element = document.getElementById(`node-${row}-${col}`);
                if (element) element.className = "node";
            }
        }

        this.setState({
            grid: newGrid,
            isRunning: false,
            startNode: null,
            endNode: null,
        });
    };

    handleMouseDown = (row, col) => {
        const { mode, grid, startNode, endNode } = this.state;
        const newGrid = grid.slice();
        const node = newGrid[row][col];

        if (mode === "start") {
            if (startNode) newGrid[startNode.row][startNode.col].isStart = false;
            node.isStart = true;
            this.setState({ startNode: node });
        } else if (mode === "end") {
            if (endNode) newGrid[endNode.row][endNode.col].isEnd = false;
            node.isEnd = true;
            this.setState({ endNode: node });
        } else if (mode === "wall") {
            if (!node.isStart && !node.isEnd) {
                node.isWall = !node.isWall;
                this.setState({ mouseIsPressed: true });
            }
        }

        this.setState({ grid: newGrid });
    };

    handleMouseEnter = (row, col) => {
        const { mouseIsPressed, mode, grid } = this.state;
        if (!mouseIsPressed || mode !== "wall") return;

        const newGrid = grid.slice();
        const node = newGrid[row][col];
        if (!node.isStart && !node.isEnd && !node.isWall) {
            node.isWall = true;
            this.setState({ grid: newGrid });
        }
    };

    handleMouseUp = () => {
        this.setState({ mouseIsPressed: false });
    };

    visualizeBFS = () => {
        const { grid, startNode, endNode } = this.state;
        if (!startNode || !endNode) {
            alert("Please select both start and end nodes.");
            return;
        }

        const visitedNodesInOrder = bfs(grid, startNode, endNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    visualizeDijkstra = () => {
        const { grid, startNode, endNode } = this.state;
        if (!startNode || !endNode) {
            alert("Please select both start and end nodes.");
            return;
        }

        const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };


    animateDijkstra = (visitedNodes, shortestPath) => {
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestPath);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodes[i];
                const element = document.getElementById(`node-${node.row}-${node.col}`);
                if (element && !node.isStart && !node.isEnd)
                    element.className = "node node-visited";
            }, 10 * i);
        }
    };

    animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                const element = document.getElementById(`node-${node.row}-${node.col}`);
                if (element && !node.isStart && !node.isEnd)
                    element.className = "node node-shortest-path";
            }, 30 * i);
        }
    };

    handleModeChange = (mode) => {
        this.setState({ mode });
    };

    render() {
        const { grid, mode } = this.state;
        return (
            <>
                <div className="controls">
                    <button onClick={() => this.handleModeChange("start")}>Select Start</button>
                    <button onClick={() => this.handleModeChange("end")}>Select End</button>
                    <button onClick={() => this.handleModeChange("wall")}>Add/Remove Walls</button>

                    <button onClick={this.visualizeDijkstra}>Visualize Dijkstra</button>
                    <button onClick={this.visualizeBFS}>Visualize BFS</button>
                    <button onClick={this.resetGrid}>Reset</button>
                    <span>Current Mode: {mode}</span>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx} className="row">
                            {row.map((node, nodeIdx) => {
                                const { row, col, isStart, isEnd, isWall } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isStart={isStart}
                                        isEnd={isEnd}
                                        isWall={isWall}
                                        onMouseDown={() => this.handleMouseDown(row, col)}
                                        onMouseEnter={() => this.handleMouseEnter(row, col)}
                                        onMouseUp={this.handleMouseUp}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
