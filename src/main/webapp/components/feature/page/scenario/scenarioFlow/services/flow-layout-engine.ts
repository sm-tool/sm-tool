import { Edge, Node } from '@xyflow/react';
import * as d3 from 'd3-hierarchy';
import { AppError, ErrorLevel } from '@/types/errors.ts';

export interface LayoutConfig {
  spacing: {
    x: number;
    y: number;
  };
  direction: 'horizontal' | 'vertical';
}

export interface LayoutData {
  nodes: Node[];
  edges: Edge[];
}

export type WithId = Record<string, unknown> & {
  id: string;
};

export class LayoutEngine {
  private config: LayoutConfig;
  private nodes: Node[];
  private readonly edges: Edge[];

  constructor(layoutData: LayoutData, config: LayoutConfig) {
    this.config = config;
    this.nodes = layoutData.nodes;
    this.edges = layoutData.edges;
  }

  public applyLayout(): LayoutData {
    const hierarchy = this.createHierarchy();
    const layoutRoot = this.createTreeLayout()(hierarchy);

    return {
      nodes: this.positionNodes(layoutRoot),
      edges: this.edges,
    };
  }

  private createGraph() {
    return {
      nodes: this.nodes.map(node => ({
        id: node.id,
        width: node.width,
        height: node.height,
        data: node.data,
      })),
      links: this.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      })),
    };
  }

  private createHierarchy() {
    return d3
      .stratify()
      .id((d: unknown) => (d as WithId).id)
      .parentId(
        (d: unknown) =>
          this.edges.find(edge => edge.target === (d as WithId).id)?.source,
      )(this.createGraph().nodes);
  }

  private getNodeSize(): [number, number] {
    const maxNodeWidth = Math.max(...this.nodes.map(node => node.width || 0));
    const maxNodeHeight = Math.max(...this.nodes.map(node => node.height || 0));

    return this.config.direction === 'horizontal'
      ? [
          maxNodeHeight + this.config.spacing.y,
          maxNodeWidth + this.config.spacing.x,
        ]
      : [
          maxNodeWidth + this.config.spacing.x,
          maxNodeHeight + this.config.spacing.y,
        ];
  }

  private calculateSeparation(
    a: d3.HierarchyNode<unknown>,
    b: d3.HierarchyNode<unknown>,
  ) {
    const nodeA = this.nodes.find(n => n.id === a.id);
    const nodeB = this.nodes.find(n => n.id === b.id);
    const spacing =
      this.config.direction === 'horizontal'
        ? this.config.spacing.x
        : this.config.spacing.y;

    if (nodeA?.width === undefined || nodeB?.width === undefined) {
      throw new AppError(
        'One of the nodes does not have a width or height',
        ErrorLevel.ERROR,
      );
    }

    return nodeA.width + nodeB.width / spacing;
  }

  private createTreeLayout() {
    return d3
      .tree()
      .nodeSize(this.getNodeSize())
      .separation((a, b) => this.calculateSeparation(a, b));
  }

  private transformPosition(x: number, y: number) {
    return this.config.direction === 'horizontal' ? { x: y, y: x } : { x, y };
  }

  private positionNodes(layoutRoot: d3.HierarchyPointNode<unknown>) {
    return this.nodes.map(node => {
      const layoutNode = layoutRoot.descendants().find(n => n.id === node.id);
      if (!layoutNode) return node;

      const { x, y } = this.transformPosition(layoutNode.x, layoutNode.y);
      return { ...node, position: { x, y } };
    });
  }
}
