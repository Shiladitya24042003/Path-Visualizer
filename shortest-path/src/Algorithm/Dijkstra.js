import MinHeap from './MinHeap';

function dijkstra(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const heap = new MinHeap();
    startNode.distance = 0;
    heap.insert(startNode);

    while (!heap.isEmpty()) {
        const closestNode = heap.extractMin();

        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(closestNode, grid);
        for (const neighbor of neighbors) {
            if (closestNode.distance + 1 < neighbor.distance) {
                neighbor.distance = closestNode.distance + 1;
                neighbor.previousNode = closestNode;
                heap.insert(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getNodesInShortestPathOrder(endNode) {
    const nodesInPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesInPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInPath;
}

export default dijkstra;
