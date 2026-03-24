import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userPhotos.css';

import fetchModel from '../../lib/fetchModelData';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      user: null
    };
  }

  componentDidMount() {
    this.loadPhotoData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.userId !==
      this.props.match.params.userId
    ) {
      this.loadPhotoData();
    }
  }

  loadPhotoData() {
    const userId = this.props.match.params.userId;

    fetchModel(`/photosOfUser/${userId}`)
      .then((response) => {
        this.setState({
          photos: response.data
        });
      })
      .catch((error) => {
        console.error('Error loading photos:', error);
      });

    fetchModel(`/user/${userId}`)
      .then((response) => {
        const userData = response.data;

        this.setState({
          user: userData
        });

        if (this.props.changeContext) {
          this.props.changeContext(
            `Photos of ${userData.first_name} ${userData.last_name}`
          );
        }
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }

  render() {
    if (!this.state.user) {
      return <Typography>Loading...</Typography>;
    }

    return (
      <div className="user-photos-container">

        <Typography variant="h5" className="photo-page-title">
          Photos of {this.state.user.first_name} {this.state.user.last_name}
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to={`/users/${this.state.user._id}`}
          sx={{ marginBottom: '16px' }}
        >
          Back to User
        </Button>

        {this.state.photos.map((photo) => (
          <Card className="photo-card" key={photo._id}>
            <CardContent>

              <Typography variant="body2" className="photo-date">
                Posted: {photo.date_time}
              </Typography>

              <img
                className="photo-image"
                src={`../../images/${photo.file_name}`}
                alt={photo.file_name}
              />

              <Divider sx={{ margin: '12px 0' }} />

              <Typography variant="subtitle1">
                Comments
              </Typography>

              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div className="comment-block" key={comment._id}>
                    <Typography variant="body2">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      {' '}on {comment.date_time}
                    </Typography>

                    <Typography variant="body1">
                      {comment.comment}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2">
                  No comments.
                </Typography>
              )}

            </CardContent>
          </Card>
        ))}

      </div>
    );
  }
}

export default UserPhotos;
