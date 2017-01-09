import React, { PropTypes } from 'react';
import Box from 'grommet/components/Box';
import Markdown from 'grommet/components/Markdown';
import Section from 'grommet/components/Section';

export default function BlockParagraph ({ content }) {
  return (

    <Section className="labs__section" 
      pad={{ horizontal: 'large', vertical: 'small' }}
      alignSelf="center">
      <Box full="horizontal">
        <Markdown content={content} components={{ 
          'p': { 'props':  { size: 'large', margin: 'small' } },
          'h2': { 'props':  { strong: true } }
        }}/>
      </Box>
    </Section>
  );
};

BlockParagraph.propTypes = {
  content: PropTypes.string
};
