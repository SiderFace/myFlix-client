import React from 'react';
import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

export const MainView = () => {
   const storedUser = JSON.parse(localStorage.getItem('user'));
   const storedToken = localStorage.getItem('token');
   const [token, setToken] = useState(storedToken ? storedToken : null);
   const [movies, setMovies] = useState([]);
   const [user, setUser] = useState(storedUser? storedUser : null);

   const updateUser = (newUser) => {
      setUser(newUser);
   };
 
   const onLoggedOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      updateUser(null);
   };

   useEffect(() => {
      getMovies(token);
   }, [token]);

   const getMovies = (token) => {
      if (!token) {
         return;
      }

      fetch('https://siders-myflix.herokuapp.com/movies', {
         headers: { Authorization: `Bearer ${token}` }
      }) .then((response) => response.json())
         .then((data) => {
            setMovies(data);
         });
   }
   
   const handleAddToFavorite = (movieId) => {
      console.log("The value of movieId is: ", movieId);

      const accessToken = localStorage.getItem('token');
      const userName = JSON.parse(localStorage.getItem('user')).Username;
      
      // Add to favorites
      fetch(`https://siders-myflix.herokuapp.com/users/${userName}/movies/${movieId}`, {
         method: 'POST',
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
         }
      })
      .then(response => response.json())
      .then(data => {
         console.log(`Movie added to favorites: ${JSON.stringify(data)}`);
         alert("Movie added to favorites");
         const updatedFavorites = [...user.FavoriteMovies, data._id];
         user.FavoriteMovies.push(data._id);
         const updateUser = { ...user, FavoriteMovies: updatedFavorites };
         setUser(updateUser);
         
      })
      .catch(error => {
         console.error(`Error adding movie to favorites: ${error}`);
      });
   };

   return (
      <BrowserRouter>
         <NavigationBar
            user={user}
            onLoggedOut={() => {
               setUser(undefined);
               setToken(undefined);
               localStorage.clear();
            } }
         />

         <Row className='justify-content-md-center'>
            <Routes>
               <Route
                  path='/login'
                  element={
                     < >
                        {user ? (
                           <Navigate to='/' />
                        ) : (
                           <Col md={3}>
                              <LoginView
                                 onLoggedIn={(user, token) => {
                                    setUser(user);
                                    setToken(token);
                                 } }
                              />
                           </Col>
                           )
                        }
                     </>
                  }
               />  
                              
               {/* <React.Fragment>
                  <br />
                  <br />
                  <br />
                  <h3>Or sign up here:</h3>
                  <br />
                  <br />
               </React.Fragment> */}

               <Route
                  path='/signup'
                  element={
                     < >
                        {user ? (
                           <Navigate to='/' />
                        ) :(
                           <Col md={3}>
                              <SignupView />
                           </Col>
                        )
                        }
                     </>
                  }
               />
               <Route
                  path='/movies/:movieId'
                  element={
                     < >
                        {!user ? (
                           <Navigate to='/login' replace />
                        ) : movies.length === 0 ? (
                           <Col>The list is empty!</Col>
                        ) : (
                           <Col md={4}>
                              <MovieView movieList={movies} />
                           </Col>
                           )
                        }
                     </>
                  }
               />
               <Route
                  path="/profile"
                  element={
                     <>
                        {!user ? (
                           <Navigate to="/login" replace />
                        ) : (
                           <Col>
                              <ProfileView user={user} token={token} movies={movies} onLoggedOut={onLoggedOut} updateUser={updateUser} />
                           </Col>
                        )}
                     </>
                  }
               />
               <Route path="/users/:Username" render={({ match }) => {
                  return (
                     <ProfileView
                        user={user}
                        token={token}
                        movies={movies}
                        favoriteMovies={user.favoriteMovies}
                        onLoggedOut={() => { onLoggedOut() }}
                        updateUser={(user) => { updateUser(user) }}
                        match={match}
                     />
                  );
               } } />

               <Route
                  path="/"
                  element={
                     < >
                        {!user ? (
                           <Navigate to='/login' replace />
                        ) : movies.length === 0 ? (
                           <Col>The list is empty!</Col>
                        ) : (
                           < >
                              {movies.map((movie) => (
                                 <Col 
                                    key={movie.id} 
                                    md={4}
                                    className='mb-5'
                                 >
                                    <MovieCard movie={movie} addToFavorites={handleAddToFavorite} />

                                 </Col>
                              ) ) }
                           </>
                           )
                        }
                     </>
                  }
               />              
            </Routes>
         </Row>
      </BrowserRouter>
   );
};