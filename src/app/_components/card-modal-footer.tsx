export const CardModalFooter = ({
  children,
  horizontalLayout,
}: React.PropsWithChildren<{ horizontalLayout?: 'between' | 'end' | 'center' | 'start' }>) => {
  return (
    <div
      className={[
        'flex items-center gap-2',
        'w-full',
        horizontalLayout === 'between'
          ? 'justify-between'
          : horizontalLayout === 'end'
            ? 'justify-end'
            : horizontalLayout === 'center'
              ? 'justify-center'
              : 'justify-end',
      ].join(' ')}
    >
      {children}
    </div>
  );
};
