import { Edge, Node, Position } from '@xyflow/react';
import { Thread } from '@/features/thread/types.ts';
import {
  FLOW_UNIT_HEIGHT,
  FLOW_UNIT_WIDTH,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import { Branching } from '@/features/branching/types.ts';
import { EventCardProperties } from '@/features/event-instance/components/event-card';

interface ThreadPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutData {
  nodes: Node[];
  edges: Edge[];
}

export class LayoutEngine {
  protected nodes: Node[];
  protected readonly edges: Edge[];
  protected readonly branchings: Branching[];
  protected readonly events: Node<EventCardProperties>[];

  constructor(
    layoutData: LayoutData,
    branchings: Branching[],
    events: Node<EventCardProperties>[],
  ) {
    this.nodes = layoutData.nodes;
    this.edges = layoutData.edges;
    this.events = events;
    this.branchings = branchings;
  }

  public applyLayout(): LayoutData {
    const processedNodes = this.processNodes();
    const processedEvents = this.processEvents(processedNodes);

    return {
      nodes: [...processedNodes, ...processedEvents],
      edges: this.edges,
    };
  }

  private getThreadFromNode(node: Node): Thread {
    return node.data.thread as Thread;
  }

  private hasTimeOverlap(thread1: Thread, thread2: Thread): boolean {
    let t1Start = thread1.startTime;
    let t1Width = thread1.endTime + 1 - thread1.startTime;

    // If there's an incoming branch, we need to shift the start position and reduce width
    // to make space for the branch connection
    if (thread1.incomingBranchingId && thread1.incomingBranchingId !== 0) {
      t1Start++;
      t1Width--;
    }

    // If there's an outgoing branch, reduce width to make space for the branch connection
    if (thread1.outgoingBranchingId && thread1.outgoingBranchingId !== 0) {
      t1Width--;
    }

    // Special case: When width becomes 0 (typically in fork->merge scenarios)
    // Instead of having a zero-width element which would be invisible and hard to interact with,
    // we create a small visible element by shifting it slightly left and giving it a minimal width
    if (t1Width === 0) {
      t1Start -= 0.25;
      t1Width += 0.5;
    }

    // Same logic applied for the second thread
    let t2Start = thread2.startTime;
    let t2Width = thread2.endTime + 1 - thread2.startTime;
    if (thread2.incomingBranchingId && thread2.incomingBranchingId !== 0) {
      t2Start++;
      t2Width--;
    }
    if (thread2.outgoingBranchingId && thread2.outgoingBranchingId !== 0) {
      t2Width--;
    }
    if (t2Width === 0) {
      t2Start -= 0.25;
      t2Width += 0.5;
    }

    const t1End = t1Start + t1Width;
    const t2End = t2Start + t2Width;

    // Standard overlap detection: if one element starts before the other ends
    return t1Start < t2End && t2Start < t1End;
  }

  private calculateThreadPosition(thread: Thread): ThreadPosition {
    let x = thread.startTime;
    let width = thread.endTime + 1 - thread.startTime;

    // Adjust position and width for incoming branch connections
    if (thread.incomingBranchingId && thread.incomingBranchingId !== 0) {
      x++;
      width--;
    }

    // Adjust width for outgoing branch connections
    if (thread.outgoingBranchingId && thread.outgoingBranchingId !== 0) {
      width--;
    }

    // Special case: When width becomes 0 (in fork->merge scenarios)
    // We shift the element slightly left and give it a minimal width
    // This ensures the element remains visible and interactive while maintaining
    // correct collision detection with other elements
    if (width === 0) {
      x -= 0.25;
      width += 0.5;
      console.log({
        x: x,
        width: width,
      });
    }

    // Convert the calculated positions to actual pixel values using the unit constants
    return {
      x: x * FLOW_UNIT_WIDTH,
      y: 0,
      width: width * FLOW_UNIT_WIDTH,
      height: FLOW_UNIT_HEIGHT,
    };
  }

  private getMinLevelFromPrevious(
    thread: Thread,
    nodeMap: Map<string, Node>,
  ): number {
    if (thread.outgoingBranchingId !== 0 && thread.incomingBranchingId === 0) {
      return 0;
    }

    if (thread.incomingBranchingId !== 0) {
      const branching = this.branchings.find(
        b => b.id === thread.incomingBranchingId,
      );
      if (!branching) return 0;

      return Math.max(
        ...branching.comingIn.map(threadId => {
          const threadNode = nodeMap.get(`thread-${threadId}`);
          if (!threadNode) return 0;
          return threadNode.position.y / FLOW_UNIT_HEIGHT;
        }),
      );
    }

    return 0;
  }

  private findAvailableLevel(
    thread: Thread,
    currentLevel: number,
    placedNodes: Node[],
  ): number {
    let level = currentLevel;
    let hasCollision;

    do {
      hasCollision = false;
      const nodesAtLevel = placedNodes.filter(
        node => node.position.y === level * FLOW_UNIT_HEIGHT,
      );

      for (const node of nodesAtLevel) {
        if (this.hasTimeOverlap(thread, this.getThreadFromNode(node))) {
          hasCollision = true;
          break;
        }
      }

      if (hasCollision) {
        level++;
      }
    } while (hasCollision);

    return level;
  }

  private processNodes(): Node[] {
    const nodeMap = new Map<string, Node>();
    return this.processNonRootNodes(nodeMap, []);
  }

  private processEvents(layoutedThreads: Node[]): Node[] {
    return this.events.map(event => {
      const parentThread = layoutedThreads.find(
        node => this.getThreadFromNode(node).id === event.data.event!.threadId,
      );

      return {
        ...event,
        position: {
          x: event.data.event!.time * FLOW_UNIT_WIDTH + FLOW_UNIT_WIDTH / 2,
          y: parentThread ? parentThread.position.y + 120 : 0,
        },
        width: FLOW_UNIT_WIDTH,
        height: FLOW_UNIT_HEIGHT,
      };
    });
  }

  private processNonRootNodes(
    nodeMap: Map<string, Node>,
    existingNodes: Node[],
  ): Node[] {
    const nonRootNodes: Node[] = [];

    for (const node of this.nodes.sort((a, b) => {
      const threadA = this.getThreadFromNode(a);
      const threadB = this.getThreadFromNode(b);
      if (threadA.id !== threadB.id) {
        return threadA.id - threadB.id;
      }
      return threadA.startTime - threadB.startTime;
    })) {
      const thread = this.getThreadFromNode(node);
      const position = this.calculateThreadPosition(thread);
      const minLevel = this.getMinLevelFromPrevious(thread, nodeMap);
      const level = this.findAvailableLevel(thread, minLevel, [
        ...existingNodes,
        ...nonRootNodes,
      ]);

      const layoutedNode = {
        ...node,
        position: {
          x: position.x,
          y: level * FLOW_UNIT_HEIGHT,
        },
        width: position.width,
        height: position.height,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      nodeMap.set(node.id, layoutedNode);
      nonRootNodes.push(layoutedNode);
    }

    return nonRootNodes;
  }
}
