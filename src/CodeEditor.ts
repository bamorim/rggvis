import { Stream, Listener } from 'xstream'
import xs from 'xstream'
import * as monaco from "monaco-editor"
import 'monaco-editor/esm/vs/basic-languages/lua/lua.contribution';
import {adapt} from '@cycle/run/lib/adapt';

export type Input = Stream<{ container: HTMLElement }>

function luaModel(): monaco.editor.ITextModel {

  let value = [
    '-- Number of steps',
    'k = 2',
    '',
    '-- Add the first vertex with self loop',
    'local pos = addVertex()',
    'connectVertices(pos, pos)',
    'setAttributes(pos, "color", "red")',
    '',
    '-- Render',
    'coroutine.yield()',
    '',
    '-- Main Loop',
    'while true do',
    '  for i=1,k do',
    '    setAttributes(pos, "color", "white")',
    '    idx = math.random(1,getNeighborCount(pos))',
    '    print("idx", idx)',
    '    pos = getNeighbor(pos, idx)',
    '    print("pos", pos)',
    '    setAttributes(pos, "color", "red")',
    '    coroutine.yield()',
    '  end',
    '  print("--")',
    '  connectVertices(pos, addVertex())',
    '  coroutine.yield()',
    'end'
  ].join("\n")

  let model = monaco.editor.createModel(value, 'lua')

  return model;
}

export function driver(input$: Input) {
  let editor : monaco.editor.IStandaloneCodeEditor | null
  let lastContainer : Element | null
  let model = luaModel();

  input$.subscribe({
    next: ({ container }) => {
      if (!container || !document.body.contains(container)) {
        if(editor) editor.dispose()
        editor = null
        return
      }

      if (!editor || container != lastContainer) {
        lastContainer = container
        editor = monaco.editor.create(container, {
          theme: 'vs-dark',
          model: model,
          minimap: {
            enabled: false
          }
        })
      }
    }
  })


  let output$ = xs.create({
    start: (listener: Listener<string>) => {
      listener.next(model.getLinesContent().join("\n"))

      model.onDidChangeContent(() => listener.next(model.getLinesContent().join("\n")))
    },
    stop: () => {}
  })

  return adapt(output$)
}