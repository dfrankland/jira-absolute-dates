import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';

const DateConfig = class extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      format: '',
    };
  }

  componentWillMount() {
    window.chrome.storage.sync.get({
      format: '',
    }, ({ format }) => {
      this.setState({ loaded: true, format });
    });
  }

  save = event => {
    const format = event.target.value;
    this.setState({ format });
    window.chrome.storage.sync.set({ format });
  };

  render() {
    const { loaded, format } = this.state;
    return (
      <div>
        <p>
          <label>
            <strong>moment.js Date Format:</strong>
            <br />
            <input
              type="text"
              onChange={this.save}
              disabled={!loaded}
              value={format}
              placeholder={!loaded ? 'Loading...' : ''}
              style={{
                fontFamily: 'monospace',
                padding: '0.25rem',
                width: '100%',
                borderRadius: '0.25rem',
              }}
            />
          </label>
        </p>
        <p>
          <strong>Example Date:</strong>
          <br />
          <code
            style={{
              fontFamily: 'monospace',
              padding: '0.25rem',
              display: 'block',
              background: 'rgb(191, 191, 191)',
              border: 'solid 1px transparent',
              borderRadius: '0.25rem',
            }}
          >
            {moment().format(format)}
          </code>
        </p>
        <p>
          <a href="http://momentjs.com/docs/#/displaying/format/" target="_blank">
            More date formatting options...
          </a>
        </p>
      </div>
    );
  }
};

render(<DateConfig />, document.getElementById('root'));
