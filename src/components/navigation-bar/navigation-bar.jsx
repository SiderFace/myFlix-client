import React from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavigationBar = ({ user, onLoggedOut, searchTerm, setSearchTerm }) => {
   return (
      <Navbar bg='light' expand='lg'>
         <Container>
            <Navbar.Brand as={Link} to='/' onClick={() => setSearchTerm('')}>
               MyFlix App
            </Navbar.Brand>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />

            <Navbar.Collapse id='basic-navbar-nav'>
               <Nav className='me-auto'>

                  {user && (
                  <>
                     <Form inline className="d-flex">
                        <FormControl
                           type='text'
                           placeholder="Search"
                           value={searchTerm}
                           onChange={event => setSearchTerm(event.target.value)}
                        />
                        {searchTerm && (
                        <Button
                           variant=''
                           onClick={() => setSearchTerm('')}
                        >
                           X
                        </Button>
                        )}
                     </Form>
                  </>
                  )}

                  {!user && (
                     < >
                        <Nav.Link as={Link} to='/Login'>
                           Login 
                        </Nav.Link>

                        <Nav.Link as={Link} to='/signup'>
                           Signup 
                        </Nav.Link>
                     </>
                  ) }

                  {user && (
                     < >
                        <Nav.Link as={Link} to='/'>
                           Home 
                        </Nav.Link>

                        <Nav.Link as={Link} to='/profile'>
                           Profile
                        </Nav.Link>

                        <Nav.Link onClick={onLoggedOut}>
                           Logout
                        </Nav.Link>
                     </>
                  ) } 
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};