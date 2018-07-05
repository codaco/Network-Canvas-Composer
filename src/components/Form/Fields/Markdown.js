import React, { PureComponent } from 'react';
import Markdown from 'react-markdown';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';

const listenTo = ['change', 'cut', 'paste', 'drop', 'keydown', 'keyup'];

class MarkdownInput extends PureComponent {
  static propTypes = {
    ...fieldPropTypes,
  };

  constructor(props) {
    super(props);

    this.state = { isFocussed: false };
    this.textarea = React.createRef();
  }

  componentWillMount() {
    this.id = uniqueId('label');
  }

  componentDidMount() {
    listenTo.forEach((eventName) => {
      this.textarea.current.addEventListener(eventName, this.resize);
    });

    this.resize();
  }

  componentWillUnmount() {
    listenTo.forEach((eventName) => {
      this.textarea.current.removeEventListener(eventName, this.resize);
    });
  }

  resize = () => {
    const height = this.textarea.current.scrollHeight;
    this.textarea.current.style.height = `${height}px`;
  };

  render() {
    const {
      input: { value },
      meta: { active },
      label,
    } = this.props;

    return (
      <label
        htmlFor={this.id}
        className={cx('form-fields-markdown', { 'form-fields-markdown--is-focussed': active })}
      >
        { label &&
          <div className="form-fields-markdown__label">{label}</div>
        }
        <div className="form-fields-markdown__edit">
          <Markdown className="form-fields-markdown__preview" source={value} />
          <div className="form-fields-markdown__input-container">
            <textarea
              className={cx('form-fields-markdown__input')}
              id={this.id}
              ref={this.textarea}
              {...this.props.input}
            />
          </div>
        </div>
      </label>
    );
  }
}

export default MarkdownInput;
