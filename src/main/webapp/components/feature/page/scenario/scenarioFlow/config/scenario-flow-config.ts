export const FLOW_UNIT_HEIGHT = 300;
export const FLOW_UNIT_WIDTH = 600;

export const FLOW_UNIT_PADDING_Y = 25;
export const FLOW_UNIT_PADDING_X = 50;

export const calculateFlowXPosition = (deltaTime: number) =>
  deltaTime * (FLOW_UNIT_WIDTH + FLOW_UNIT_PADDING_X * 2) + FLOW_UNIT_PADDING_X;

export const calculateFlowYPosition = (threadYIndex: number) =>
  threadYIndex * (FLOW_UNIT_HEIGHT + FLOW_UNIT_HEIGHT * 2) +
  FLOW_UNIT_PADDING_Y;
