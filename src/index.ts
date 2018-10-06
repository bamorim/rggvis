import { h, MainDOMSource, makeDOMDriver, VNode } from '@cycle/dom';
import { run } from '@cycle/run';
import { adapt } from '@cycle/run/lib/adapt';
import { Stream, MemoryStream, Listener } from 'xstream';
import xs from 'xstream';

import { Edge } from './Model';
import { randomWalkModel } from './Models';
import { Simulation, RenderableGraph } from './Simulator';
import { GraphView } from "./GraphView";

interface Sources {
  dom: MainDOMSource;
  simulation: Stream<RenderableGraph>;
}

interface Sinks {
  dom: Stream<VNode>;
  graphView: Stream<{ container: Element, state: RenderableGraph | null }>;
  simulation: Stream<any>;
}

interface AppState {
  paused: boolean,
  speed: number
}

function main(sources: Sources): Sinks {
  const pauseChange$: Stream<boolean> =
    sources.dom
      .select('input.pause')
      .events('change')
      .map(ev => (ev.target as HTMLInputElement).checked)
      .startWith(false)

  const speedChange$: Stream<number> =
    sources.dom
      .select('input.speed')
      .events('change')
      .map(ev => {
        let x = parseInt((ev.target as HTMLInputElement).value)
        console.log(x)
        return x;
      })
      .startWith(0)

  const state$: Stream<AppState> = xs.combine(pauseChange$, speedChange$)
    .map(([paused, speed]) => ({ paused, speed }))
    .startWith({ paused: false, speed: 0 });

  const view$ = state$.map((state) =>
    h('div', [
      h('div.graphview', {attrs: {style: "position: fixed; height: 100%; width: 100%"}}, []),
      h('div', { attrs: { style: "position: fixed" } }, [
        h('input.pause', { attrs: { type: 'checkbox' } }, []),
        h('label', [state.paused ? "Unpause" : "Pause"]),
        h('input.speed', { attrs: { type: 'range', min: 0, max: 100, value: state.speed } }, [])
      ])
    ])
  );

  const container$ = sources.dom.select('.graphview').element()

  const graphView$ = xs.combine(sources.simulation, container$)
    .map(([state, container]) => ({ state, container }))

  const periodFromSpeed = (speed: number) => 200 + 8 * (100 - speed)

  const simulationTick$ = state$
    .map(({ paused, speed }) => paused ? xs.empty() : xs.periodic(periodFromSpeed(speed)))
    .flatten()

  const sinks: Sinks = {
    dom: view$,
    graphView: graphView$,
    simulation: simulationTick$
  };
  return sinks;
}

const drivers = {
  dom: makeDOMDriver('#app'),
  graphView: graphDriver,
  simulation: simulationDriver
};

run(main, drivers);

function simulationDriver(input$: Stream<any>) {
  const simulation = new Simulation({ pos: 0 }, randomWalkModel(2));
  let inputListener: Partial<Listener<any>> | null = null;

  return adapt(xs.create({
    start: function(listener) {
      inputListener = {
        next: (received) => {
          listener.next(simulation.next().value)
        }
      }
      input$.addListener(inputListener)
    },
    stop: () => {
      if (inputListener != null) input$.removeListener(inputListener)
    }
  }))
}

function graphDriver(input$: Stream<{ container: Element, state: RenderableGraph | null }>) {
  let graphView: GraphView | null;
  let lastVersion: String = "";
  input$.subscribe({
    next: ({ container, state }) => {
      if (!container) {
        graphView = null;
        return;
      } else if (!graphView) {
        graphView = new GraphView(container);
      }

      if (state && lastVersion != state.version) {
        lastVersion = state.version
        if (state != null) {
          graphView.updateGraph(state)
        } else {
          graphView.reset()
        }
      }
    }
  })
}

