import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Graph from 'model/Graph'

import HighlightedVertexDetails from './HighlightedVertexDetails'

const graph = new Graph()

const attributes = new Map([['color', 'blue'], ['foo', 'foo'], ['bar', 'bar']])

graph.addVertex()

const vertexId = graph.addVertex()

attributes.forEach((val, key) => {
  graph.setAttribute(vertexId, key, val)
})
storiesOf('HighlightedVertexDetails', module).add('with a simple graph', () => (
  <HighlightedVertexDetails graph={graph} vertexId={vertexId} />
))
