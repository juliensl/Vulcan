import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import withStyles from '@material-ui/core/styles/withStyles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';


const styles = theme => ({
  group: {
    marginTop: '8px',
  },
  twoColumn: {
    display: 'block',
    [theme.breakpoints.down('md')]: {
      '& > label': {
        marginRight: theme.spacing.unit * 5,
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '49%',
      },
    },
  },
  threeColumn: {
    display: 'block',
    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing.unit * 5,
      },
    },
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '49%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '32%',
      },
    },
  },
});


const MuiCheckboxGroup = createReactClass({
  
  mixins: [ComponentMixin],
  
  propTypes: {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(['checkbox', 'switch']),
  },
  
  componentDidMount: function () {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }
  },
  
  getDefaultProps: function () {
    return {
      label: '',
      help: null,
      variant: 'checkbox',
    };
  },
  
  changeCheckbox: function () {
    const value = [];
    const { options, name } = this.props.inputProperties;
    options.forEach(function (option, key) {
      if (this[name + '-' + option.value].checked) {
        value.push(option.value);
      }
    }.bind(this));

    this.props.onChange(value);
  },
  
  validate: function () {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    return true;
  },
  
  renderElement: function () {
    const { name, options, disabled: _disabled } = this.props.inputProperties;
    const controls = options.map((checkbox, key) => {
      let value = checkbox.value;
      let checked = (value.indexOf(value) !== -1);
      let disabled = checkbox.disabled || _disabled;
      const Component = this.props.variant === 'switch' ? Switch : Checkbox;
      
      return (
        <FormControlLabel
          key={key}
          control={
            <Component
              inputRef={(c) => this[name + '-' + value] = c}
              checked={checked}
              onChange={this.changeCheckbox}
              value={value}
              disabled={disabled}
            />
          }
          label={checkbox.label}
        />
      );
    });
    
    const maxLength = options.reduce((max, option) =>
      option.label.length > max ? option.label.length : max, 0);
  
    const columnClass = maxLength < 20 ? 'threeColumn' : maxLength < 30 ? 'twoColumn' : '';
    
    return (
      <FormGroup className={classNames(this.props.classes.group, this.props.classes[columnClass])}>
        {controls}
      </FormGroup>
    );
  },
  
  render: function () {
    
    if (this.props.layout === 'elementOnly') {
      return (
        <div>{this.renderElement()}</div>
      );
    }
    
    return (
      <MuiFormControl{...this.getFormControlProperties()} fakeLabel={true}>
        {this.renderElement()}
        <MuiFormHelper {...this.getFormHelperProperties()}/>
      </MuiFormControl>
    );
  }
});


export default withStyles(styles)(MuiCheckboxGroup);
