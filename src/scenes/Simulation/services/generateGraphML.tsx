import * as xmlbuilder from 'xmlbuilder'
import { ReadGraph } from 'graph'

export const generateGraphML = (graph: ReadGraph) => {
  // TODO: Add attributes in GraphML export
  const nodeXml = graph.vertices.map((v, i) => ({ '@id': `n${i}` }))
  const edgeXml = graph.edges.map(([s, t], i) => ({
    '@source': `n${s}`,
    '@target': `n${t}`
  }))
  const graphXml = {
    graphml: {
      '@xmlns': 'http://graphml.graphdrawing.org/xmlns',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation': [
        'http://graphml.graphdrawing.org/xmlns',
        'http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd'
      ].join(' '),
      graph: {
        '@id': 'G',
        '@edgedefault': 'undirected',
        node: nodeXml,
        edge: edgeXml
      }
    }
  }
  const xml = xmlbuilder
    .create(graphXml, { encoding: 'utf-8' })
    .end({ pretty: true })
  return new Blob([xml], { type: 'application/graphml+xml;charset=utf-8' })
}