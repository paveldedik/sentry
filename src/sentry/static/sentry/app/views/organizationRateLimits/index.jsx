import React from 'react';

import OrganizationHomeContainer from '../../components/organizations/homeContainer';
import OrganizationState from '../../mixins/organizationState';
import TooltipMixin from '../../mixins/tooltip';

const RangeInput = React.createClass({
  getDefaultProps() {
    return {
      min: 1,
      max: 100,
      step: 1,
      formatLabel: function(value) {
        return value;
      },
      onChange: function(e, value) {

      },
    };
  },

  getInitialState() {
    return {
      value: this.props.defaultValue,
    };
  },

  componentDidMount() {
    let {min, max, step} = this.props;
    var $value = $('<span class="value" />');
    $(this.refs.input).on('slider:ready', (e, data) => {
      $value.appendTo(data.el);
      $value.text(this.props.formatLabel(data.value));
      this.setState({
        value: data.value,
      });
    }).on('slider:changed', (e, data) => {
      $value.text(this.props.formatLabel(data.value));
      this.setState({
        value: data.value,
      });
      this.props.onChange(e, data.value);
    }).simpleSlider({
      range: [min, max],
      step: step,
      snap: true
    });
  },

  render() {
    let {min, max, step} = this.props;
    let {value} = this.state;
    return (
      <input type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={value}
          ref="input" />
    );
  },
});

const RateLimitEditor = React.createClass({
  getInitialState() {
    let projectLimit = this.props.organization.quota.projectLimit;

    return {
      activeNav: 'rate-limits',
      currentProjectLimit: projectLimit,
      savedProjectLimit: projectLimit,
    };
  },

  onProjectLimitChange(e, value) {
    this.setState({
      currentProjectLimit: value,
    });
  },

  render() {
    let {currentProjectLimit, savedProjectLimit} = this.state;
    let maxRate = this.props.organization.quota.maxRate;
    let needsSave = savedProjectLimit === currentProjectLimit;

    return (
      <div>
        <p>Your organization is limited to <strong>{maxRate} events per minute</strong>.
          When this rate is exceeded the system will begin discarding data until the
          next interval.</p>

        <p>You may set a limit the maximum amount a single project may send:</p>

        <RangeInput
            defaultValue={savedProjectLimit}
            onChange={this.onProjectLimitChange}
            formatLabel={(value) => { return `${value}%`; }} />

        <div className="help-block">The maximum percentage of your quota an
          individual project can consume.</div>

        <div className="form-actions" style={{marginTop: 25}}>
          <button
            className="btn btn-primary"
            disabled={needsSave}>Apply Changes</button>
        </div>
      </div>
    );
  }
});

const OrganizationRateLimits = React.createClass({
  mixins: [OrganizationState],

  render() {
    if (!this.context.organization)
      return null;

    let org = this.context.organization;
    // TODO(dcramer): defined limit is only for testing atm
    let maxRate = org.quota.maxRate || 1000;

    return (
      <OrganizationHomeContainer>
        <div className="box">
          <div className="box-header">
            <h3>Rate Limits</h3>
          </div>
          <div className="box-content with-padding">
            {maxRate !== 0 ?
              <RateLimitEditor organization={org} />
            :
              <p>There are no rate limits configured for your organization.</p>
            }
          </div>
        </div>
      </OrganizationHomeContainer>
    );
  },
});


export default OrganizationRateLimits;
