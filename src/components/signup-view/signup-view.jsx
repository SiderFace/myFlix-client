import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './signup-view.scss'

export const SignupView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');

   const handleSubmit = (event) => {
      event.preventDefault();

      const data = {
         Username: username,
         Password: password,
         Email: email,
         Birthdate: birthdate
      };

      fetch('https://siders-myflix.herokuapp.com/users', {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
         'Content-Type': 'application/json'
         }
      }).then((response) => {
         if (response.ok) {
         alert("Signup successful");
         window.location.reload();
         } else {
         alert("Signup failed");
         }
      });
   };

   return (
      <Form className='signup-form' onSubmit={handleSubmit}>
         <Form.Group controlId='formUsername'>
            <Form.Label>Username:</Form.Label>
            <Form.Control
               type='text'
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
               minLength={3}
            />
         </Form.Group>
         <br />
         <Form.Group controlId='formPassword'>
            <Form.Label>Password:</Form.Label>
            <Form.Control
               type='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
         </Form.Group>
            <br />
         <Form.Group controlId='formEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
               type='email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
         </Form.Group>
         <br />
         <Form.Group controlId='formBirthday'>
            <Form.Label>Birthday</Form.Label>
            <Form.Control
          type='date'
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
            />
         </Form.Group>
         <br />
         <Button type='submit'>Submit</Button>

      </Form>
   );
};