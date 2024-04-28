// Dash.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import GroupList from './GroupList';
import GroupModal from './Group_modal';
import './Style.css';
import { useLocation } from 'react-router-dom';
const Dash = () => {
  const location = useLocation();
  const phoneWithoutCountryCode = location.state?.phone || '';
  const [isModalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [groups, setGroups] = useState([]);
  const phone = phoneWithoutCountryCode.replace(/^\+91/, '');
  const openModal = () => {
    setModalOpen(true);
  };
  console.log("Phone:",phone)
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleGroupAdded = () => {
    // Trigger a re-fetch of groups when a new group is added
    setGroups((prevGroups) => [...prevGroups]); // This creates a new array to trigger a re-render
  };
  const handleSubmit = async (data) => {
    try {
      // Handle the submitted data (e.g., send it to the server)
      console.log('Submitted data:', data);

      // Fetch the updated list of groups
      const updatedGroups = await fetchGroups();
      setGroups(updatedGroups);

      // Close the modal after handling the submit
      closeModal();

      // Trigger the handleGroupAdded function to re-fetch groups
      handleGroupAdded();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://13.201.44.172/groups', {
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        },
      });

      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.error('Invalid data structure in API response:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch initial list of groups
        const initialGroups = await fetchGroups();
        setGroups(initialGroups);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='book'>
      <title>Booking</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="style.css" />
      <center><h3 style={{ color: 'rgb(201, 131, 1)' }}><b>My Grocery Task</b></h3></center>
      <div className="tabular" style={{ color: 'rgb(201, 131, 1)' }}>
        <ul>
          <a href="/login" style={{ color: '#1b1b1b' }}><li>Home</li></a>
          <a href=" " style={{ color: '#1b1b1b' }}><li>About us</li></a>
          <a href="snack.html" style={{ color: '#1b1b1b' }} target="_blank"><li>Tags</li></a>
          <a href="/register" style={{ color: '#1b1b1b' }}><li>Logout</li></a>
        </ul>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <button
          style={{
            backgroundColor: '#5A9C56',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.3s', // Add transition for a smooth effect
          }}
          // Open the modal on button click
          onClick={openModal}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#467d45')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#5A9C56')}
        >
          Create New Group
        </button>
      </div>

      {/* Include the GroupList component with the updated groups state */}
      <GroupList onGroupAdded={handleGroupAdded}phone={phone} />
      
      {/* Include the GroupModal component with the correct prop and onSubmit callback */}
      <GroupModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} phone={phone} />

    </div>  
  );
};

export default Dash;
