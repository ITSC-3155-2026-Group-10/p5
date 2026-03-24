import React from 'react';
import {
  Typography,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';

import fetchModel from '../../lib/fetchModelData';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.loadUser();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.userId !==
      this.props.match.params.userId
    ) {
      this.loadUser();
    }
  }

  loadUser() {

    const userId = this.props.match.params.userId;

    fetchModel(`/user/${userId}`)
      .then((response) => {

        const userData = response.data;

        this.setState({
          user: userData
        });

        if (this.props.changeContext) {
          this.props.changeContext(
            `${userData.first_name} ${userData.last_name}`
          );
        }

      })
      .catch((error) => {
        console.error("Error loading user:", error);
      });
  }

  render() {

    if (!this.state.user) {
      return <Typography>Loading...</Typography>;
    }

    const user = this.state.user;

    return (

      <div className="user-detail-container">

        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>

        <Typography>
          Location: {user.location}
        </Typography>

        <Typography>
          Description: {user.description}
        </Typography>

        <Typography>
          Occupation: {user.occupation}
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to={`/photos/${user._id}`}
          sx={{ marginTop: "10px" }}
        >
          View Photos
        </Button>

      </div>

    );
  }
}

export default UserDetail;
