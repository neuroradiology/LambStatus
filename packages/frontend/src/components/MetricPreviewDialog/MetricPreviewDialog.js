import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/Button'
import RadioButton from 'components/RadioButton'
import MetricsGraph from 'containers/MetricsGraph'
import { timeframes } from 'utils/status'
import classes from './MetricPreviewDialog.scss'

class MetricPreviewDialog extends React.Component {
  static propTypes = {
    metricID: PropTypes.string.isRequired,
    onClosed: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { timeframe: timeframes[0] }
  }

  componentDidMount () {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      dialog.showModal()
    }
  }

  handleChangeTimeframe = (value) => {
    this.setState({timeframe: value})
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  render () {
    const timeframesSelector = timeframes.map((timeframe) => {
      let checked = timeframe === this.state.timeframe
      return (
        <RadioButton key={timeframe} onChange={this.handleChangeTimeframe} label={timeframe}
          checked={checked} groupName='timeframes' />
      )
    })

    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Preview
      </h2>
      <div className='mdl-dialog__content'>
        <div className={classes.timeframes}>
          {timeframesSelector}
        </div>
        <div className='mdl-list'>
          <MetricsGraph metricID={this.props.metricID} timeframe={this.state.timeframe} />
        </div>
        Note: if the metric added just now, try again in 1 minute. Data will be backfilled up to 24 hours in the past.
        <div className='mdl-dialog__actions'>
          <Button onClick={this.handleHideDialog} name='Cancel' />
        </div>
      </div>
    </dialog>)
  }
}

export default MetricPreviewDialog