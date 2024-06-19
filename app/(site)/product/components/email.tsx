import * as React from 'react';
import { Html, Button } from '@react-email/components';

interface EmailProps {
  url: string;
}

export function Email({ url }: EmailProps) {
  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}
