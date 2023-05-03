import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './movie-card.scss';

export const MovieCard = ({ movie, handleClickActions, buttonTitle }) => {

   const [isFavorite, setIsFavorite] = useState(false);

   const handleClick = () => {
      handleClickActions(movie._id)
      setIsFavorite(true);
    };

   return (
      <Card className='h-100'>
         <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
            <Card.Img variant='top' src={movie.ImagePath} />
         </Link>
         <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Director.Name}</Card.Text>
            <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
               <Button variant='link'> Open </Button>
            </Link>
            <Button variant="outline-primary" onClick={handleClick} disabled={isFavorite}>{buttonTitle}</Button>
         </Card.Body>
      </Card>
   );
};

MovieCard.propTypes = {
   movie: PropTypes.shape({
      Title: PropTypes.string.isRequired,
      ImagePath: PropTypes.string,
      Director: PropTypes.object
   }).isRequired,
   handleClickActions: PropTypes.func.isRequired,
   buttonTitle: PropTypes.string.isRequired,
};