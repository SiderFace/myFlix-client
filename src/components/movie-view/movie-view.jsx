import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import './movie-view.scss';
import Button from 'react-bootstrap/Button';

export const MovieView = ({movieList}) => {
   const {movieId} = useParams();
   const myMovie = movieList && movieList.find(movie => movie._id === (movieId));

   return (
      <div className='movie-info'>
         <div>
            <img src={myMovie.ImagePath} alt={"Poster for : " + myMovie.Title} />
         </div>
         <br />
         <div>
            <span className='heading'>Title:   </span>
            <span>{myMovie.Title}</span>
         </div>
         <br />
         <div>
            <span className='heading'>Genre:   </span>
            <span>{myMovie.Genre.Name}</span>
         </div>
         <br />
         <div>
            <span className='heading'>Description: </span>
            <span>{myMovie.Description}</span>
         </div>
         <br /> 
         <div>
            <span className='heading'>Director: </span>
            <span>{myMovie.Director.Name}</span>
         </div>
         <br />
         <div>
            <span className='heading'>Released: </span>
            <span>{myMovie.Released}</span>
         </div>

         <br />
         
         <Button className='back-button'>
            <Link to='/'> Back </Link>
         </Button>
      </div>
   );
 };
 