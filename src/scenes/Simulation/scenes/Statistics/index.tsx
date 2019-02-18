import * as React from 'react'
import { ReadGraph } from 'graph'
import { withStyles, createStyles, Grid } from '@material-ui/core'

import DegreeDistributionCollector from './services/DegreeDistributionCollector'
import DistanceToRootDistributionCollector from './services/DistanceToRootDistributionCollector'

import DistributionView from './components/DistributionView'
import GraphGeneralStatisicsDisplay from './components/GraphGeneralStatisticsDisplay'

interface Props {
  graph: ReadGraph
  classes: Record<keyof typeof styles, string>
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: '10px'
  },
  centered: {
    textAlign: 'center'
  }
})

class MetricsView extends React.Component<Props> {
  private degreeDist: DegreeDistributionCollector
  private rootDistanceDist: DistanceToRootDistributionCollector

  constructor(props: Props) {
    super(props)
    this.degreeDist = new DegreeDistributionCollector(props.graph)
    this.rootDistanceDist = new DistanceToRootDistributionCollector(props.graph)
  }

  public render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12} className={classes.centered}>
            <GraphGeneralStatisicsDisplay graph={this.props.graph} />
          </Grid>
          <Grid item={true} xs={6}>
            <DistributionView
              distribution={this.degreeDist.subject}
              name="Degree"
            />
          </Grid>
          <Grid item={true} xs={6}>
            <DistributionView
              distribution={this.rootDistanceDist.subject}
              name="Distance to Root"
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(MetricsView)