// framer-motionのモック
export const motion = {
  div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
    <li {...props}>{children}</li>
  ),
};

export const AnimatePresence = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
