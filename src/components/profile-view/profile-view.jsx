import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Button, Row, Container } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import './profile-view.scss';

export const ProfileView = ({ user, token, movies, onLoggedOut }) => {

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const [birthdate, setBirthdate] = useState('');
   const [favoriteMovies, setFavoriteMovies] = useState(user.FavoriteMovies || []);
   const [filteredMovies, setFilteredMovies] = useState([]);

   const handleGetUserFavorites = () => {
      const accessToken = localStorage.getItem('token');
      const userName = JSON.parse(localStorage.getItem('user')).Username;
      
      fetch(`https://siders-myflix.herokuapp.com/users/${userName}`, {
         method: 'GET',
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
         }
      })
      .then(response => response.json())
      .then(data => {

         const filtered = movies.filter(movie => data.FavoriteMovies.includes(movie._id))
         setFilteredMovies(filtered);
      })
      .catch(error => {
         console.error(`Error: ${error}`);
      });
   };
   
   const handleRemoveFromFavorites = (movieId) => {
   
      const accessToken = localStorage.getItem('token');
      const userName = JSON.parse(localStorage.getItem('user')).Username;
   
      fetch(`https://siders-myflix.herokuapp.com/users/${userName}/movies/${movieId}`, {
         method: 'DELETE',
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
         }
      })
      .then(response => response.json())
      .then(data => {
         console.log(`Movie removed from favorites: ${JSON.stringify(data)}`);
         alert("Movie removed from favorites");
   
         const updatedFavorites = user.FavoriteMovies.filter(id => id !== movieId);
         setUser({ ...user, FavoriteMovies: updatedFavorites });
   
         setMovies(prevMovies => prevMovies.map(movie => {
            if (movie._id === movieId) {
            return {
               ...movie,
               Favorite: false
            }
            } else {
            return movie;
            }
         }))
   
      })
      .catch(error => {
         console.error(`Error removing movie from favorites: ${error}`);
      });
   };

   const handleClick = () => {
      setIsFavorite(false);
      removeFromFavorites(movie._id);
      if (user && user.FavoriteMovies) {
        setFavoriteMovies([user.FavoriteMovies, movie._id]);
        setUser(updateUser);
      }
    };

   useEffect(() => {
      handleGetUserFavorites();
   }, []);

   const handleSubmit = async(event) => {
      event.preventDefault();

      const data = {
         Username: username,
         Password: password,
         Email: email,
         Birthday: birthdate
       }       
 
      const updateUser = await fetch(`https://siders-myflix.herokuapp.com/users/${user.Username}`, {
         method: 'PUT',
         body: JSON.stringify(data),
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
         }
      })

      const response = await updateUser.json()
         if (response) {
            alert("Changes successful");
            localStorage.clear();
            window.location.reload();
         } else {
            alert("Changes successful");
         }
   };

   const deleteAccount = () => {
      fetch(`https://siders-myflix.herokuapp.com/users/${user.Username}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
         if (response.ok) {
               alert("The account has been deleted.");
               onLoggedOut();
         } else {
               alert("Could not delete the account");
         }
      })
      .catch(e => {
         alert(e);
      });
   }

   return (
      <Container className='profile-container'>
         <Row>
            <Col xs={12} sm={4}>           
               <Card className='user-info-card'>
                  <Card.Body>
                     <Card.Title>Your info :</Card.Title>
                     <br />
                     <p>Name: {user.Username}</p>
                     <p>e-mail: {user.Email}</p>
                     <p>Birthday: {user.Birthday}</p>
                  </Card.Body>
                  <br />
                  <div className='text-center'>
                     <Button
                        className='w-75'
                        onClick={() => {
                           if (confirm("Are you sure?")) {
                           deleteAccount();
                           }
                        }}>Delete user account
                     </Button>
                  </div>
                  <br />
               </Card>
            </Col>
            <br />
            <Col xs={12} sm={8}>
               <Card className='user-info-card'>
                  <Card.Body>
                     <Card.Title>Update your info :</Card.Title>
                     <br />
                     <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group>
                           <Form.Label>Username:</Form.Label>
                           <Form.Control
                              type='text'
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                              required
                              minLength={3}
                           />
                        </Form.Group>
                        <br />
                        <Form.Group>
                           <Form.Label>Password:</Form.Label>
                           <Form.Control
                              type='password'
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                           />
                        </Form.Group>
                        <br />
                        <Form.Group>
                           <Form.Label>e-mail:</Form.Label>
                           <Form.Control
                              type='email'
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                           />
                        </Form.Group>
                        <br />
                        <Form.Group>
                           <Form.Label>Birthday:</Form.Label>
                           <Form.Control
                              type='date'
                              value={birthdate}
                              onChange={e => setBirthdate(e.target.value)}
                           />
                        </Form.Group>
                        <br />
                        <Button type='submit'>Submit</Button>
                     </Form>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         <Row>
            <Col className='favorites-header'>
               <h3>Your Favorites:</h3>
            </Col>
            <br />
         </Row>
         <br />
         <Row>
            {filteredMovies.map(movie => (              
            <Col
               className='mb-3'
               xs={12} md={6} lg={3}
               justify-content-md-center
               key={movie.id}
            >
               
               <MovieCard
                  movie={movie}
                  handleClickActions={handleRemoveFromFavorites}
                  setFavoriteMovies={setFavoriteMovies}
                  user={user}
                  buttonTitle="Remove from Favorites"
                  onClick={handleClick}
               />
            </Col>
            ))}
         </Row>
      </Container>
   );
}