import React, { ReactNode } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

interface DefaultProps {
  children: ReactNode;
}
const Default: React.FC<DefaultProps> = ({ children }: DefaultProps) => {
  return (
    <Container>
      <Box my={5}>{children}</Box>
    </Container>
  );
};
export default Default;
