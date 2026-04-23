import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';

import axios from 'axios';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.get('/user/list')
    .then((response) => {
      this.setState({
        users: response.data
      });
    })
    .catch((error) => {
      console.error('Error loading users:', error);
    });
  }

  <UserList currentUser={this.state.currentUser} />
  
  render() {
    return (
      <List component="nav">

        {this.state.users.map((user) => (

          <div key={user._id}>

            <ListItem
              button
              component={Link}
              to={`/users/${user._id}`}
            >

              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
              />

            </ListItem>

            <Divider />

          </div>

        ))}

      </List>
    );
  }
}

export default UserList;
