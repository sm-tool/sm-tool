const DynamicGrid = ({ items }: { items: string[] }) => {
  return (
    <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
      <div
        className={`grid place-items-center gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3
          xl:grid-cols-4`}
        style={{}}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={
              'w-full truncate rounded-lg bg-neutral-200 p-4 text-center shadow-md'
            }
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicGrid;
