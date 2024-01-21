import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './NameInputComponent.css'; // Import your custom CSS for styling
import { useUserId } from './context/userId';

const Intro = () => {
  const [name, setName] = useState('');
  const [disable, setDisable] = useState(false);
  const history = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const createUser = async (name) => {
    try {
      const response = await fetch('http://localhost:8080/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return response.json();
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  };

  const { setSelectedUserId } = useUserId();
  const redirectToPage = async (path) => {
    setDisable(true);
    if (path === 'jobs' && name === '') {
      toast.error('Enter your name');
      setDisable(false);
    } else if (name.trim() !== '' && path === 'jobs') {
      try {
        const newUser = await toast.promise(createUser(name), {
          loading: 'Creating user...',
          success: 'User created successfully!',
          error: 'Failed to create user',
        });
        if (newUser) {
          setDisable(false);

          setSelectedUserId(newUser);
        }
        history(`/${path}?name=${encodeURIComponent(name)}`);
      } catch (error) {
        console.error(error);
        setDisable(false);
      }
    } else if (path === 'pdf') {
      history(`/${path}`);
      setDisable(false);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <h1 className="intro">Welcome to MockIt</h1>
        <p className="intro-para">
          Step into the world of MockIt, where intelligent conversations and
          interactive experiences await. Embark on an innovative journey that
          blurs the lines between human interaction and artificial intelligence.
          Whether you're here to start a stimulating conversation or delve into
          administration, your adventure begins by simply entering your name.
          Let MockIt redefine your digital encounters – your next experience is
          just a name away!
        </p>
        <h2 className="title">Enter Your Name</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
        />
        <button
          className="button"
          disabled={disable}
          style={{
            backgroundColor: disable ? 'grey' : 'blue',
          }}
          onClick={() => redirectToPage('jobs')}
        >
          Select Job
        </button>
        <button
          className="button"
          disabled={disable}
          style={{
            backgroundColor: disable ? 'grey' : 'blue',
          }}
          onClick={() => redirectToPage('pdf')}
        >
          Go to Admin Page
        </button>
      </div>
    </div>
  );
};

export default Intro;
