interface Node {
  id: string | number;
  parentId?: string | number;
  children?: Node[];
}

export const listToTree = (list: Node[]) => {
  const nodes = list.map<Node & { children: Node[] }>((el) => ({
    ...el,
    children: [],
  }));
  const map = new Map<string | number, Node & { children: Node[] }>();
  const tree: Node[] = [];

  for (const node of nodes) {
    map.set(node.id, node);
  }

  for (const node of nodes) {
    const parent = map.get(node.parentId || Number.NaN);

    if (parent) {
      parent.children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
};

export const chunk = <TElement>(
  array: TElement[],
  size: number,
): TElement[][] => {
  const result: TElement[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};
