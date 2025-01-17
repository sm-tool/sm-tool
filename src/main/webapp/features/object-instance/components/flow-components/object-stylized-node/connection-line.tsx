const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}) => {
  return (
    <g>
      <path
        d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
        fill='none'
        stroke='#fed747'
        strokeWidth={4}
        style={{
          pointerEvents: 'none',
          stroke: '#15803d',
          fillOpacity: 2,
          strokeDasharray: '8,8',
          strokeDashoffset: -1,
        }}
        markerEnd={`url(#arrow-start)`}
        className='stroke-[4px] animate-dash-forward'
      />
      <defs>
        <marker
          id={`arrow-start`}
          viewBox='0 0 10 10'
          markerWidth={6}
          markerHeight={6}
          orient='auto'
          refX={9}
          refY={5}
        >
          <path d='M 0 0 L 10 5 L 0 10 z' fill='#15803d' stroke='none' />
        </marker>
      </defs>
    </g>
  );
};

export default CustomConnectionLine;
