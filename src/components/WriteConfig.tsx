import fs from 'fs';
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Style, useProgram } from '@boost/cli/react';

interface WriteConfigProps {
  data: object;
  path: string;
}

export default function WriteConfig({ data, path }: WriteConfigProps): Element {
  const { exit } = useProgram();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fs.promises
      .writeFile(path, JSON.stringify(data), 'utf8')
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        exit(error);
      });
  }, [path]);

  if (loading) {
    return (
      <Box>
        <Text>Writing config file...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text>
        Wrote config to file{' '}
        <Style type="success" children={''}>
          {path}
        </Style>
      </Text>
    </Box>
  );
}
