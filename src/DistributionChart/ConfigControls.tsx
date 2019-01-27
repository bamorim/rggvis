import * as React from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  createStyles,
  withStyles
} from '@material-ui/core'
import { ChartConfig, Transformation } from './types'

interface Props extends ChartConfig {
  setXLog: (xLog: boolean) => void
  setYLog: (yLog: boolean) => void
  setTransformation: (xLog: Transformation) => void
  classes: Record<keyof typeof styles, string>
}

const styles = createStyles({
  radioGroup: {
    flexDirection: 'row'
  }
})

class ConfigControls extends React.PureComponent<Props> {
  public render() {
    return (
      <FormControl>
        <FormLabel>Transformation</FormLabel>
        <RadioGroup
          aria-label="Transformation"
          name="transformation"
          value={this.props.transformation}
          classes={{ root: this.props.classes.radioGroup }}
          onChange={(e, val) =>
            this.props.setTransformation(val as Transformation)
          }
        >
          <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
          <FormControlLabel value="cdf" control={<Radio />} label="CDF" />
          <FormControlLabel value="ccdf" control={<Radio />} label="CCDF" />
        </RadioGroup>

        <FormLabel>X Scale</FormLabel>
        <RadioGroup
          aria-label="Transformation"
          name="transformation"
          value={this.props.xLog ? 'log' : 'linear'}
          classes={{ root: this.props.classes.radioGroup }}
          onChange={(e, val) => this.props.setXLog(val === 'log')}
        >
          <FormControlLabel value="linear" control={<Radio />} label="Linear" />
          <FormControlLabel value="log" control={<Radio />} label="Log" />
        </RadioGroup>

        <FormLabel>Y Scale</FormLabel>
        <RadioGroup
          aria-label="Transformation"
          name="transformation"
          value={this.props.yLog ? 'log' : 'linear'}
          classes={{ root: this.props.classes.radioGroup }}
          onChange={(e, val) => this.props.setYLog(val === 'log')}
        >
          <FormControlLabel value="linear" control={<Radio />} label="Linear" />
          <FormControlLabel value="log" control={<Radio />} label="Log" />
        </RadioGroup>
      </FormControl>
    )
  }
}

export default withStyles(styles)(ConfigControls)
