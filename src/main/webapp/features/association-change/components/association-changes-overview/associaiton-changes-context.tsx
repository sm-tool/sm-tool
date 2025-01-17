import { Connection, Edge, MarkerType, Node } from '@xyflow/react';
import { ObjectInstance } from '@/features/object-instance/types.ts';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import {
  usePossibleAssociationMapForEvent,
  usePreviousEventState,
} from '@/features/event-instance/queries.ts';
import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useObjectInstancesOfThread } from '@/features/object-instance/queries.ts';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';

interface AssociationFlow {
  nodes: Node[];
  edges: Edge[];
  calculateLayout: (objects: ObjectInstance[]) => void;
  onConnect: (connection: Connection) => void;
  onDeleteCurrentChange: (
    object1Id: number,
    object2Id: number,
    wasDeleting: boolean,
  ) => void;
  onAssociationBreak: (object1Id: number, object2Id: number) => void;
  possibleConnections: Map<string, number>;

  toggleNodeVisibility: (nodeId: string) => void;
  hiddenNodes: Set<string>;

  disabled?: boolean;
}

const calculatePosition = (nodes: Node[], edges: Edge[]) => {
  const d3Edges = edges.map(edge => ({
    source: edge.source,
    target: edge.target,
  }));

  const nodeCount = nodes.length;
  const baseStrength = -1500;
  const strengthMultiplier = Math.max(1, nodeCount / 8);
  // @ts-expect-error -- lib types clash
  const simulation = forceSimulation(nodes)
    .force(
      'charge',
      forceManyBody()
        .strength(baseStrength * strengthMultiplier)
        .distanceMax(2500),
    )
    .force('center', forceCenter(0, 0).strength(0.08))
    .force(
      'link',
      forceLink(d3Edges)
        // @ts-expect-error -- szczerze nie wiem kto te typy pisał
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- oj +1 byczqu
        .id(d => d.id)
        .distance(_ => Math.min(900, 450 + nodeCount * 12))
        .strength(0.6),
    )
    .force('collision', forceCollide().radius(200).strength(0.9).iterations(3))
    .force('x', forceX(0).strength(0.05))
    .force('y', forceY(0).strength(0.05))
    .alphaMin(0.001)
    .alphaDecay(0.015);

  const iterations = Math.max(150, nodeCount * 3);
  for (let index = 0; index < iterations; index++) {
    simulation.tick();
  }

  return nodes.map(node => ({
    ...node,
    position: {
      // @ts-expect-error -- lib types clash
      // eslint-disable-next-line -- lib types clasht
      x: node.x ?? centerPosition.x,
      // @ts-expect-error -- lib types clash
      // eslint-disable-next-line -- lib types clasht
      y: node.y ?? centerPosition.y,
    },
  }));
};

const AssociationFlowContext = React.createContext<AssociationFlow | null>(
  null,
);
export const AssociationFlowProvider = ({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const [hiddenNodes, setHiddenNodes] = React.useState<Set<string>>(new Set());

  const { threadId } = useParams({ strict: false });
  const { event, createAssociationState, deleteAssociationState } =
    useEventForm();
  const { data: eventState } = usePreviousEventState(event.id);
  const { data: objects } = useObjectInstancesOfThread(Number(threadId));
  const { possibleConnections, allConnections } =
    usePossibleAssociationMapForEvent(event.id);

  const combinedObjects = React.useMemo(() => {
    if (!objects) return [];
    return [...objects.global, ...objects.local];
  }, [objects]);

  const objectIds = new Set(
    combinedObjects.map(object => object.id.toString()),
  );

  const calculateLayout = React.useCallback(() => {
    if (!objects) return;
    const initialNodes = combinedObjects
      .filter(object => !hiddenNodes.has(object.id.toString()))
      .map(
        object =>
          ({
            id: object.id.toString(),
            type: 'objectStylized',
            position: {
              x: 0,
              y: 0,
            },
            data: { objectId: object.id, disabled: disabled },
            width: 350,
            dragHandle: '.drag-handle',
          }) as Node,
      );

    const currentEdges = event.associationChanges
      .filter(
        change =>
          objectIds.has(change.object1Id.toString()) &&
          objectIds.has(change.object2Id.toString()) &&
          !hiddenNodes.has(change.object1Id.toString()) &&
          !hiddenNodes.has(change.object2Id.toString()),
      )
      .map(change => ({
        id: `${change.object1Id}-${change.object2Id}`,
        source: change.object1Id.toString(),
        target: change.object2Id.toString(),
        type: 'associationStylized',

        data: {
          associationId: change.associationTypeId,
          changeType: change.changeType,
          disabled: disabled,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: change?.changeType.to === 'INSERT' ? '#16a34a' : '#dc2626',
        },
      }));

    const currentEdgesIds = new Set(
      currentEdges.map(edge => `${edge.source}-${edge.target}`),
    );

    const previousEdges =
      eventState?.associationsState
        .filter(
          association =>
            objectIds.has(association.object1Id.toString()) &&
            objectIds.has(association.object2Id.toString()) &&
            !hiddenNodes.has(association.object1Id.toString()) &&
            !hiddenNodes.has(association.object2Id.toString()) &&
            association.associationOperation === 'INSERT' &&
            !currentEdgesIds.has(
              `${association.object1Id}-${association.object2Id}`,
            ),
        )
        .map(association => ({
          id: `prev-${association.object1Id}-${association.object2Id}`,
          source: association.object1Id.toString(),
          target: association.object2Id.toString(),
          type: 'associationStylizedUnchaned',
          data: {
            associationId: association.associationTypeId,
            disabled: disabled,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 25,
            height: 25,
          },
        })) || [];

    const allEdges = [...previousEdges, ...currentEdges];
    const layoutedNodes = calculatePosition(initialNodes, allEdges);
    setNodes(layoutedNodes);
    setEdges(allEdges);
  }, [
    event.associationChanges,
    eventState,
    combinedObjects,
    objects,
    hiddenNodes,
  ]);

  React.useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  const toggleNodeVisibility = React.useCallback((nodeId: string) => {
    setHiddenNodes(previous => {
      const newHidden = new Set(previous);
      if (newHidden.has(nodeId)) {
        newHidden.delete(nodeId);
      } else {
        newHidden.add(nodeId);
      }
      return newHidden;
    });
  }, []);

  const onConnect = React.useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const newEdge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'associationStylized',
        data: {
          associationId: allConnections.get(
            `${connection.source}-${connection.target}`,
          ),
          changeType: { to: 'INSERT' },
          isCurrentEdge: true,
          isUnsaved: true,
          disabled: disabled,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: '#16a34a',
        },
      };
      setEdges(previousEdges => {
        const updatedEdges = [...previousEdges, newEdge];
        const newNodes = calculatePosition(nodes, updatedEdges);
        setNodes(newNodes);
        return updatedEdges;
      });

      createAssociationState({
        associationTypeId: allConnections.get(
          `${connection.source}-${connection.target}`,
        )!,
        object1Id: Number(connection.source),
        object2Id: Number(connection.target),
        changeType: { from: null, to: 'INSERT' },
      });
    },
    [nodes],
  );

  const onDeleteCurrentChange = React.useCallback(
    (object1Id: number, object2Id: number, wasDeleting: boolean) => {
      if (wasDeleting) {
        const newEdge = {
          id: `prev-${object1Id}-${object2Id}`,
          source: object1Id.toString(),
          target: object2Id.toString(),
          type: 'associationStylizedUnchaned',
          data: {
            associationId: allConnections.get(`${object1Id}-${object2Id}`),
            disabled: disabled,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 25,
            height: 25,
          },
        };

        setEdges(edges => [
          ...edges.filter(edge => edge.id !== `${object1Id}-${object2Id}`),
          newEdge,
        ]);
      } else {
        setEdges(previousEdges => {
          const updatedEdges = previousEdges.filter(
            edge => edge.id !== `${object1Id}-${object2Id}`,
          );
          const newNodes = calculatePosition(nodes, updatedEdges);
          setNodes(newNodes);
          return updatedEdges;
        });
      }

      deleteAssociationState({
        associationTypeId: allConnections.get(`${object1Id}-${object2Id}`)!,
        object1Id: Number(object1Id),
        object2Id: Number(object2Id),
        changeType: wasDeleting
          ? { from: 'INSERT', to: 'DELETE' }
          : { from: null, to: 'INSERT' },
      });
    },
    [nodes],
  );

  const onAssociationBreak = React.useCallback(
    (object1Id: number, object2Id: number) => {
      const newEdge = {
        id: `${object1Id}-${object2Id}`,
        source: object1Id.toString(),
        target: object2Id.toString(),
        type: 'associationStylized',
        data: {
          associationId: allConnections.get(`${object1Id}-${object2Id}`),
          changeType: 'DELETE',
          disabled: disabled,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: '#dc2626',
        },
      };

      setEdges(edges => [
        ...edges.filter(edge => edge.id !== `prev-${object1Id}-${object2Id}`),
        newEdge,
      ]);

      createAssociationState({
        associationTypeId: allConnections.get(`${object1Id}-${object2Id}`)!,
        object1Id: Number(object1Id),
        object2Id: Number(object2Id),
        changeType: { from: 'INSERT', to: 'DELETE' },
      });
    },
    [edges, possibleConnections],
  );

  const value = React.useMemo(
    () => ({
      nodes,
      edges,
      calculateLayout,
      onConnect,
      onDeleteCurrentChange,
      onAssociationBreak,
      possibleConnections,
      toggleNodeVisibility,
      hiddenNodes,
      disabled,
    }),
    [
      nodes,
      edges,
      calculateLayout,
      onConnect,
      possibleConnections,
      toggleNodeVisibility,
      hiddenNodes,
      disabled,
    ],
  );

  return (
    <AssociationFlowContext.Provider value={value}>
      {children}
    </AssociationFlowContext.Provider>
  );
};

export const useAssociationFlow = () => {
  const context = React.useContext(AssociationFlowContext);
  if (!context) {
    throw new Error(
      'useAssociationFlow must be used within AssociationFlowProvider',
    );
  }
  return context;
};
