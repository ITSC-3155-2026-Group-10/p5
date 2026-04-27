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
      app_info: undefined,
      photo_upload_show: false,
    photo_upload_error: false,
    photo_upload_success: false
      version: ''
    };
  this.handleLogout = this.handleLogout.bind(this);
  this.handleNewPhoto = this.handleNewPhoto.bind(this);
  }

<TopBar
  context={this.state.context}
  currentUser={this.state.currentUser}
  setCurrentUser={this.SetCurrentUser}
/>

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

handleLogout = () => {
      axios.post("/admin/logout")
          .then(() =>
          {
              this.props.changeUser(undefined);
          })
          .catch( error => {
              this.props.changeUser(undefined);
              console.log(error);
          });  
  };

handleNewPhoto = (e) => {
      e.preventDefault();
      if (this.uploadInput.files.length > 0) {
          const domForm = new FormData();
          domForm.append('uploadedphoto', this.uploadInput.files[0]);
          axios.post("/photos/new", domForm)
              .then(() => {
                  this.setState({
                      photo_upload_show: true,
                      photo_upload_error: false,
                      photo_upload_success: true
                  });
              })
              .catch(error => {   
                  this.setState({
                      photo_upload_show: true,
                      photo_upload_error: true,
                      photo_upload_success: false
                    });  
                  console.log(error);
                });
        }
    };
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
