import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      version: ''
    };
  }

  componentDidMount() {
    axios.get('/test/info')
  .then((response) => {
    this.setState({
      version: response.data.__v
    });
  })
  .catch((error) => {
    console.error('Error fetching version:', error);
  });
  }

  render() {
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
            Macari Allison
          </Typography>

          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            {this.props.context}
          </Typography>

          <Typography variant="h6" color="inherit">
            Version {this.state.version}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
