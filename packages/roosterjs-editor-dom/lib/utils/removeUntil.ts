/**
 * Remove node and its next siblings until the specified stop node is hit.
 * If the stop node is null or is never hit, remove the given node and all nodes after it under the same parent
 * @param removeFrom The node to remove from.
 * @param nodeToStop The node to stop remove when we see it in the DOM tree
 * @returns When the stop node is hit, return the stop node, otherwise return null
 */
export default function removeUntil(removeFrom: Node | null, nodeToStop?: Node) {
    while (removeFrom && (!nodeToStop || removeFrom != nodeToStop)) {
        const nodeToRemove = removeFrom;
        removeFrom = removeFrom.nextSibling;
        nodeToRemove.parentNode?.removeChild(nodeToRemove);
    }
    return removeFrom;
}
